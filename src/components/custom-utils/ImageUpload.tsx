'use client'

import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ImageUploadProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  error?: string
  accept?: string
  maxSize?: number // in MB
  className?: string
  aspectRatio?: 'square' | 'banner' | 'profile'
  label?: string
  description?: string
  placeholder?: string
}

export function ImageUpload({
  value,
  onChange,
  error,
  accept = 'image/jpeg,image/png,image/webp',
  maxSize = 5,
  className,
  aspectRatio = 'square',
  label,
  description,
  placeholder = 'Click or drag file to this area to upload'
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  )
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    square: 'aspect-square',
    banner: 'aspect-video',
    profile: 'aspect-square rounded-full'
  }

  const handleFile = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onChange(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-secondary-9 mb-2">
          {label}
        </label>
      )}

      {preview ? (
        // Image Preview
        <div className={cn(
          'relative w-full overflow-hidden border-2 border-brand-neutral-3 bg-neutral-1',
          aspectClasses[aspectRatio]
        )}>
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className={cn(
              'object-cover',
              aspectRatio === 'profile' && 'rounded-full'
            )}
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg disabled:opacity-50"
          >
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex items-center gap-2 text-white">
                <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Upload Area
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'w-full border-[1.5px] border-dashed transition-all cursor-pointer',
            'flex flex-col items-center justify-center gap-3 p-6',
            aspectClasses[aspectRatio],
            isDragging
              ? 'border-brand-primary-5 bg-brand-primary-1'
              : 'border-brand-secondary-5 bg-white hover:border-brand-neutral-5 hover:bg-brand-neutral-2',
            error && 'border-red-400',
            isUploading && 'pointer-events-none opacity-50'
          )}
        >
          <Icon
            icon="iconoir:cloud-upload"
            className={cn(
              'size-8',
              isDragging ? 'text-brand-primary-6' : 'text-brand-secondary-5'
            )}
          />
          <div className="text-center px-4 text-brand-secondary-5">
            <p className="font-medium text-sm">
              {placeholder}
            </p>
            {description && (
              <p className="mt-1 text-xs text-brand-secondary-4">
                {description}
              </p>
            )}
            <p className="mt-1 text-xs text-brand-secondary-4">
              Max size: {maxSize}MB • JPEG, PNG, WEBP
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={isUploading}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1.5 ml-1">{error}</p>
      )}
    </div>
  )
}

// Specialized components for different use cases
export function ProfileImageUpload(props: Omit<ImageUploadProps, 'aspectRatio' | 'label' | 'description' | 'placeholder'>) {
  return (
    <ImageUpload
      {...props}
      aspectRatio="profile"
      label="Profile Image"
      description="Upload a professional profile picture"
      placeholder="Upload profile image"
      maxSize={2}
    />
  )
}

export function BannerImageUpload(props: Omit<ImageUploadProps, 'aspectRatio' | 'label' | 'description' | 'placeholder'>) {
  return (
    <ImageUpload
      {...props}
      aspectRatio="banner"
      label="Banner Image"
      description="Upload a banner image for your profile"
      placeholder="Upload banner image"
      maxSize={5}
    />
  )
}
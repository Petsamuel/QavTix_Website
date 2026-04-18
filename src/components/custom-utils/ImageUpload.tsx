'use client'

import { useRef, useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ImageUploadProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  error?: string
  accept?: string
  maxSize?: number
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
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }
    if (typeof value === 'string') {
      setPreview(value)
      return
    }
    if (value instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(value)
    }
  }, [value])

  const aspectClasses = {
    square:  'aspect-square',
    banner:  'aspect-video',
    profile: 'aspect-square rounded-full',
  }

  const handleFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
    onChange(file)
    // Preview is handled by the useEffect above reacting to value change
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
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-secondary-9 mb-2">
          {label}
        </label>
      )}

      {preview ? (
        <div className={cn(
          'relative w-full overflow-hidden border-2 border-neutral-3 bg-neutral-1',
          aspectClasses[aspectRatio]
        )}>
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className={cn('object-cover', aspectRatio === 'profile' && 'rounded-full')}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
          >
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'w-full border-[1.5px] border-dashed transition-all cursor-pointer',
            'flex flex-col items-center justify-center gap-3 p-6',
            aspectClasses[aspectRatio],
            isDragging
              ? 'border-primary-5 bg-primary-1'
              : 'border-secondary-5 bg-white hover:border-neutral-5 hover:bg-neutral-2',
            error && 'border-red-400',
          )}
        >
          <Icon
            icon="iconoir:cloud-upload"
            className={cn('size-8', isDragging ? 'text-primary-6' : 'text-secondary-5')}
          />
          <div className="text-center px-4 text-secondary-5">
            <p className="font-medium text-sm">{placeholder}</p>
            {description && <p className="mt-1 text-xs text-secondary-4">{description}</p>}
            <p className="mt-1 text-xs text-secondary-4">Max size: {maxSize}MB • JPEG, PNG, WEBP</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1.5 ml-1">{error}</p>}
    </div>
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
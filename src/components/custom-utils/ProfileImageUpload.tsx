'use client'

import { useState, useRef } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ProfileImageUploadProps {
    value?: File | string | null
    onChange: (file: File | null) => void
    error?: string
    disabled?: boolean
}

export default function ProfileImageUpload({
    value,
    onChange,
    error,
    disabled = false,
}: ProfileImageUploadProps) {

    const [preview, setPreview] = useState<string | null>(
        typeof value === 'string' ? value : null
    )
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = (file: File) => {
        if (file.size > 2 * 1024 * 1024) {
            alert("Image must be less than 2MB")
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)

        onChange(file)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    const handleRemove = () => {
        setPreview(null)
        onChange(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-secondary-9 mb-2">
                Profile Image
            </label>

            {preview ? (
                // Preview Mode
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-sm">
                    <Image
                        src={preview}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={disabled}
                        className="absolute top-4 z-10 right-5 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <Icon icon="lucide:x" className="size-3" />
                    </button>
                </div>
            ) : (
                // Upload Area
                <div
                    onClick={() => !disabled && inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault()
                        if (!disabled) setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={cn(
                        "w-32 h-32 mx-auto rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
                        isDragging ? "border-primary-6 bg-primary-1" : "border-neutral-6 hover:border-neutral-7",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <Icon icon="solar:camera-bold" className="w-8 h-8 text-neutral-6 mb-1" />
                    <p className="text-[10px] text-center text-primary-5 leading-tight">
                        Upload Photo
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFile(file)
                        }}
                        disabled={disabled}
                        className="hidden"
                    />
                </div>
            )}

            {error && (
                <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
            )}

            <p className="text-center text-[10px] text-neutral-6 mt-2">
                Max 2MB • JPG, PNG, WEBP
            </p>
        </div>
    )
}
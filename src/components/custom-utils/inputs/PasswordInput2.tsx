'use client'

import { forwardRef, useState } from 'react'
import { Icon } from '@iconify/react'

interface PasswordInput2Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    required?: boolean
    autoComplete?: string
}

const PasswordInput2 = forwardRef<HTMLInputElement, PasswordInput2Props>(
    ({ label, error, required, className = '', autoComplete, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)
        const [isFocused, setIsFocused] = useState(false)

        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-neutral-9 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <div
                    className={`
                        relative flex items-center gap-3 px-4 py-3.5 rounded-[6px] h-14 transition-all duration-200
                        outline-none bg-white
                        ${error 
                            ? 'border border-red-400 focus-within:border-red-500' 
                            : isFocused 
                                ? 'border-[1.5px] border-primary' 
                                : 'border-[1.5px] border-neutral-5 hover:border-neutral-6'
                        }
                    `}
                >
                    <input
                        ref={ref}
                        type={showPassword ? 'text' : 'password'}
                        className={`flex-1 outline-none text-sm text-neutral-9 placeholder:text-neutral-6 bg-transparent ${className}`}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                        autoComplete={autoComplete || 'current-password'}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="shrink-0 p-1 hover:bg-neutral-2 rounded transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <Icon icon="octicon:eye-16" className="w-5 h-5 text-neutral-8" />
                        ) : (
                            <Icon icon="octicon:eye-closed-16" className="w-5 h-5 text-neutral-8" />
                        )}
                    </button>
                </div>

                {error && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

export default PasswordInput2;
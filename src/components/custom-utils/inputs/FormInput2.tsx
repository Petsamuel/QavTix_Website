'use client'

import { forwardRef } from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    required?: boolean,
    helperText?: string
}

const FormInput2 = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, required, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-neutral-9 mb-2">
                    {label} {required && <span className="">*</span>}
                </label>
                <input
                    ref={ref}
                    className={`
                        w-full px-4 py-3 text-sm rounded-[6px] h-14 transition-all
                        ${error 
                            ? 'border border-red-400 focus:border-red-500' 
                            : 'focus:border focus:border-neutral-5 hover:border-neutral-5'
                        }
                        outline-none bg-neutral-3 text-neutral-10 placeholder:text-neutral-7
                        ${className}
                    `}
                    {...props}
                />
                {
                    helperText &&
                    <p className='text-sm text-neutral-8 mt-1'>{helperText}</p>
                }
                {error && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)


export default FormInput2;
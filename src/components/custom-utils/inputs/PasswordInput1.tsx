import { Icon } from "@iconify/react";
import { useState } from "react";

interface IPasswordInput1Props {
    placeholder?: string;
    error?: string;
    value?: string;
    helperText?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
}

export default function PasswordInput1({ 
    placeholder = 'Password',
    error,
    value,
    helperText,
    onChange,
    ...props 
}: IPasswordInput1Props) {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="w-full">
            <div 
                className={`
                    relative flex items-center gap-3 px-4 py-3.5 
                    rounded-[6px] border border-neutral-5 h-14 text-smtransition-all duration-200
                    bg-white
                    ${error 
                        ? 'border-red-400 focus-within:border-red-500' 
                        : isFocused 
                            ? 'border-primary-6 shadow-sm' 
                            : 'border-neutral-5 hover:border-primary-5'
                    }
                `}
            >
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 outline-none text-sm text-neutral-9 placeholder:text-neutral-7 bg-transparent"
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 p-1 hover:bg-[rgb(var(--neutral-2))] rounded transition-colors"
                    tabIndex={-1}
                >
                    {!showPassword ? (
                        <Icon icon="octicon:eye-closed-16" className="w-5 h-5 text-neutral-8" />
                    ) : (
                        <Icon icon="octicon:eye-16" className="w-5 h-5 text-neutral-8" />
                    )}
                </button>
            </div>
            {
                helperText && !error &&
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
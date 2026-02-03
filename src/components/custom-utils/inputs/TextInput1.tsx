import { Icon } from '@iconify/react';
import { useState } from 'react';
import ErrorPara from '../ErrorPara';

// Text/Email Input Component

interface ITextInput1Props {
    type?: 'text' | 'email';
    placeholder?: string;
    icon?: string
    error?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
}

export default function TextInput1({ 
    type = 'text',
    placeholder,
    icon,
    error,
    value,
    onChange,
    ...props 
}: ITextInput1Props) {

    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full">
            <div 
                className={`
                    relative flex items-center gap-3 px-4 py-3.5 
                    rounded-[6px] border border-neutral-5 h-14 text-sm text-neutral-10 placeholder:text-neutral-7 transition-all duration-200
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
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 outline-none text-sm text-neutral-9 placeholder:text-neutral-7 bg-transparent"
                    {...props}
                />
                {
                    icon &&
                    <Icon
                        icon={icon} 
                        className={`size-6 shrink-0 transition-colors ${
                            error 
                                ? 'text-red-400' 
                                : isFocused 
                                    ? 'text-primary-6' 
                                    : 'text-neutral-8'
                        }`} 
                    />
                }
            </div>
            {error && (
                <ErrorPara error={error} />
            )}
        </div>
    )
}
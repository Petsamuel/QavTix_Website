import { cn } from "@/lib/utils";

interface ICategoryItemBtn {
    category: Category,
    handleToggle: (v: string) => void;
    isSelected: boolean
    showCount: boolean
}

export default function CategoryItemBtn({ category, showCount, handleToggle, isSelected }: ICategoryItemBtn){
    return (
        <button
            key={category.value}
            onClick={() => handleToggle(category.value)}
            className={cn(
                'w-full flex items-center gap-3 text-secondary-9 px-4 py-3 rounded-md text-xs transition-colors',
                isSelected
                    ? 'bg-neutral-3 font-medium'
                    : ''
            )}
        >
            <span className="font-medium">{category.label}</span>
            {
                showCount &&
                <span
                    className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium min-w-9.5 text-center',
                        isSelected
                            ? 'bg-accent-5 text-white'
                            : 'bg-neutral-3 text-neutral-7'
                    )}
                >
                    {category.count}
                </span>
            }
        </button>
    )
}
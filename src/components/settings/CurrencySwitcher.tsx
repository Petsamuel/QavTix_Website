import { currencies } from "@/components-data/settings.data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserSettings } from "@/lib/custom-hooks/useUserSettings"
import { cn } from "@/lib/utils"

export default function CurrencySwitcher({ className }: { className?: string }) {
    const { currency, isPending, updateCurrency } = useUserSettings()

    const handleCurrencyChange = (v: string) => {
        const currencyObj = currencies.find(curr => curr.code === v)
        if (currencyObj) {
            updateCurrency(currencyObj)
        }
    }

    return (
        <Select 
            value={currency.code} 
            onValueChange={handleCurrencyChange}
            disabled={isPending}
        >
            <SelectTrigger
                className={cn(
                    "text-neutral-8 font-medium disabled:cursor-not-allowed disabled:opacity-65 w-28 bg-white rounded-lg border-neutral-3 hover:border-neutral-4 focus:border-primary-6",
                    className
                )}
            >
                <SelectValue placeholder="Select Currency" />
            </SelectTrigger>
            <SelectContent>
                {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                        <span className="flex items-center gap-2">
                            <span>{curr.symbol}</span>
                            <span>{curr.code}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

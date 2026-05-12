import { regions } from "@/components-data/settings.data";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUserSettings } from "@/lib/custom-hooks/useUserSettings";
import { cn } from "@/lib/utils";
import { CircleFlag } from 'react-circle-flags'



export default function RegionSwitcher({ className }: { className?: string }) {
    const { region, isPending, updateRegion } = useUserSettings()
    
    const handleRegionChange = (v: string) => {
        const regionObj = regions.find(r => r.code === v)
        regionObj && updateRegion(regionObj)
    }

    return (
        <Select value={region.code} onValueChange={handleRegionChange} disabled={true}>
            <SelectTrigger
                disabled={true}
                className={cn(
                    className,
                    "disabled:opacity-100 text-xs disabled:cursor-default w-28 bg-white rounded-lg border-neutral-3"
                )}
            >
                <SelectValue>
                    <span className="flex items-center gap-2">
                        <CircleFlag countryCode={region.code.toLowerCase()} className="size-6" />
                        <span>{region.code}</span>
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {regions.map((r) => (
                    <SelectItem key={r.code} value={r.code}>
                        <span className="flex items-center gap-2">
                            <CircleFlag countryCode={r.code.toLowerCase()} className="size-6" />
                            <span className="text-xs">{r.code}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
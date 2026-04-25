'use client'

import { useState } from 'react'
import { MobileBottomSheet } from '@/components/custom-utils/EventFilterDropdownMobileBottomSheet'
import FilterButtonsActions1 from '@/components/custom-utils/buttons/event-search/FilterActionButtons1'
import EventFilterTypeBtn from '@/components/custom-utils/buttons/event-search/EventFilterTypeBtn'
import { useMediaQuery } from '@/lib/custom-hooks/UseMediaQuery'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimestampFilterProps {
    value?: Date | null
    onChange: (value: Date | null) => void
    filterFor?: "homepage" | "eventPage"
    label?: string
}

// ─── Quick presets ────────────────────────────────────────────────────────────

interface QuickPreset {
    label: string
    getValue: () => Date
}

const QUICK_PRESETS: QuickPreset[] = [
    { label: "Now", getValue: () => new Date() },
    { label: "Today start", getValue: () => startOfDay(new Date()) },
    { label: "Today end", getValue: () => endOfDay(new Date()) },
    { label: "Week start", getValue: () => startOfWeek(new Date(), { weekStartsOn: 1 }) },
    { label: "Week end", getValue: () => endOfWeek(new Date(), { weekStartsOn: 1 }) },
]

// ─── Time Picker ──────────────────────────────────────────────────────────────

interface TimePickerProps {
    hour: number
    minute: number
    period: "AM" | "PM"
    onHourChange: (h: number) => void
    onMinuteChange: (m: number) => void
    onPeriodChange: (p: "AM" | "PM") => void
}

function TimePicker({ hour, minute, period, onHourChange, onMinuteChange, onPeriodChange }: TimePickerProps) {
    const inputClass = cn(
        "w-12 text-center text-sm font-semibold text-brand-secondary-9",
        "bg-brand-neutral-1 border border-brand-neutral-3 rounded-lg py-1.5",
        "focus:outline-none focus:border-brand-primary-5 focus:ring-1 focus:ring-brand-primary-3",
        "transition-colors"
    )

    return (
        <div className="flex items-center justify-center gap-1.5">
            {/* Hour */}
            <input
                type="number"
                min={1}
                max={12}
                value={String(hour).padStart(2, "0")}
                onChange={(e) => {
                    const val = Math.min(12, Math.max(1, Number(e.target.value)))
                    onHourChange(val)
                }}
                className={inputClass}
            />

            <span className="text-brand-neutral-6 font-bold text-sm select-none">:</span>

            {/* Minute */}
            <input
                type="number"
                min={0}
                max={59}
                value={String(minute).padStart(2, "0")}
                onChange={(e) => {
                    const val = Math.min(59, Math.max(0, Number(e.target.value)))
                    onMinuteChange(val)
                }}
                className={inputClass}
            />

            {/* AM / PM toggle */}
            <div className="flex items-center bg-brand-neutral-2 rounded-lg p-0.5 ml-1">
                {(["AM", "PM"] as const).map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPeriodChange(p)}
                        className={cn(
                            "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                            period === p
                                ? "bg-brand-primary-6 text-white shadow-sm"
                                : "text-brand-neutral-7 hover:text-brand-secondary-8"
                        )}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    )
}

// ─── Quick Preset Buttons ─────────────────────────────────────────────────────

interface QuickTimestampButtonsProps {
    selected: Date | null
    onSelect: (date: Date) => void
}

function QuickTimestampButtons({ selected, onSelect }: QuickTimestampButtonsProps) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {QUICK_PRESETS.map((preset) => {
                const val = preset.getValue()
                const isActive = selected
                    ? Math.abs(selected.getTime() - val.getTime()) < 60_000
                    : false

                return (
                    <button
                        key={preset.label}
                        type="button"
                        onClick={() => onSelect(val)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            isActive
                                ? "bg-brand-primary-6 text-white border-brand-primary-6"
                                : "bg-brand-neutral-1 border-brand-neutral-3 text-brand-neutral-7 hover:border-brand-primary-4 hover:text-brand-secondary-8"
                        )}
                    >
                        {preset.label}
                    </button>
                )
            })}
        </div>
    )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function to12Hour(h: number): { hour: number; period: "AM" | "PM" } {
    if (h === 0) return { hour: 12, period: "AM" }
    if (h < 12) return { hour: h, period: "AM" }
    if (h === 12) return { hour: 12, period: "PM" }
    return { hour: h - 12, period: "PM" }
}

function to24Hour(hour: number, period: "AM" | "PM"): number {
    if (period === "AM") return hour === 12 ? 0 : hour
    return hour === 12 ? 12 : hour + 12
}

function formatTimestamp(date: Date): string {
    return format(date, "MMM dd, h:mm a")
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TimestampFilter({
    value,
    onChange,
    filterFor = "homepage",
    label = "Timestamp",
}: TimestampFilterProps) {
    const isTablet = useMediaQuery("(min-width: 768px)")
    const [isOpen, setIsOpen] = useState(false)

    // Internal draft state — only committed on Apply
    const now = new Date()
    const { hour: initHour, period: initPeriod } = to12Hour(value?.getHours() ?? now.getHours())

    const [selectedDay, setSelectedDay] = useState<Date | undefined>(value ?? undefined)
    const [hour, setHour] = useState(initHour)
    const [minute, setMinute] = useState(value?.getMinutes() ?? now.getMinutes())
    const [period, setPeriod] = useState<"AM" | "PM">(initPeriod)

    // Build a Date from the current draft state
    const buildDraft = (day: Date | undefined = selectedDay): Date | null => {
        if (!day) return null
        const d = new Date(day)
        d.setHours(to24Hour(hour, period), minute, 0, 0)
        return d
    }

    const handlePresetSelect = (date: Date) => {
        const { hour: h, period: p } = to12Hour(date.getHours())
        setSelectedDay(date)
        setHour(h)
        setMinute(date.getMinutes())
        setPeriod(p)
    }

    const handleApply = () => {
        onChange(buildDraft())
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelectedDay(undefined)
        setHour(to12Hour(new Date().getHours()).hour)
        setMinute(new Date().getMinutes())
        setPeriod(to12Hour(new Date().getHours()).period)
        onChange(null)
        setIsOpen(false)
    }

    const hasActiveFilter = !!value
    const displayText = hasActiveFilter ? formatTimestamp(value!) : label
    const triggerVariant = filterFor === "homepage" ? "default" : "compact"

    const filterContent = (
        <div className="space-y-4">
            {/* Quick presets */}
            <QuickTimestampButtons
                selected={buildDraft()}
                onSelect={handlePresetSelect}
            />

            {/* Divider */}
            <div className="h-px bg-brand-neutral-3" />

            {/* Calendar */}
            <DayPicker
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                className="p-0 w-full"
                classNames={{
                    months: "w-full",
                    month: "w-full",
                    caption: "flex justify-between items-center mb-2 px-1",
                    caption_label: "text-sm font-semibold text-brand-secondary-8",
                    nav: "flex gap-1",
                    nav_button: cn(
                        "size-7 flex items-center justify-center rounded-lg",
                        "border border-brand-neutral-3 text-brand-neutral-6",
                        "hover:bg-brand-neutral-2 hover:text-brand-secondary-8 transition-colors"
                    ),
                    nav_button_previous: "",
                    nav_button_next: "",
                    table: "w-full border-collapse",
                    head_row: "grid grid-cols-7 mb-1",
                    head_cell: "text-center text-[11px] font-medium text-brand-neutral-5 py-1",
                    row: "grid grid-cols-7",
                    cell: "flex items-center justify-center",
                    day: cn(
                        "size-8 flex items-center justify-center rounded-lg text-xs font-medium",
                        "text-brand-secondary-8 hover:bg-brand-primary-1 hover:text-brand-primary-7 transition-colors"
                    ),
                    day_selected: "!bg-brand-primary-6 !text-white hover:!bg-brand-primary-7",
                    day_today: "border border-brand-primary-4 text-brand-primary-6 font-semibold",
                    day_outside: "text-brand-neutral-4 opacity-50",
                    day_disabled: "opacity-30 cursor-not-allowed",
                }}
            />

            {/* Divider */}
            <div className="h-px bg-brand-neutral-3" />

            {/* Time picker */}
            <div className="space-y-2">
                <p className="text-xs font-medium text-brand-neutral-6 text-center">Time</p>
                <TimePicker
                    hour={hour}
                    minute={minute}
                    period={period}
                    onHourChange={setHour}
                    onMinuteChange={setMinute}
                    onPeriodChange={setPeriod}
                />
            </div>

            {/* Preview */}
            {(selectedDay) && (
                <div className="rounded-lg bg-brand-primary-1 border border-brand-primary-3 px-3 py-2 text-center">
                    <p className="text-xs text-brand-primary-7 font-semibold">
                        {formatTimestamp(buildDraft()!)}
                    </p>
                </div>
            )}
        </div>
    )

    const dropdownClasses = cn(
        "w-[22em] z-100! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
        "data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-4",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
        "data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-top-4"
    )

    return (
        <>
            {/* Mobile — Bottom Sheet */}
            {!isTablet && (
                <>
                    <EventFilterTypeBtn
                        onClick={() => setIsOpen(true)}
                        displayText={displayText}
                        hasActiveFilter={hasActiveFilter}
                        variant={triggerVariant}
                    />
                    <MobileBottomSheet
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Timestamp"
                    >
                        {filterContent}
                        <FilterButtonsActions1
                            onApply={handleApply}
                            onClear={handleClear}
                        />
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet — Dropdown */}
            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <EventFilterTypeBtn
                                onClick={() => setIsOpen(true)}
                                displayText={displayText}
                                hasActiveFilter={hasActiveFilter}
                                variant={triggerVariant}
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={dropdownClasses} align="start">
                        <div className="space-y-4">
                            {filterContent}
                            <FilterButtonsActions1
                                onApply={handleApply}
                                onClear={handleClear}
                            />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}
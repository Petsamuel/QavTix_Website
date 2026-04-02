'use client'

import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface AddToCalendarButtonProps {
    event: {
        title:       string
        description?: string
        location?:   string
        startDate:   string   // ISO string
        endDate?:    string   // ISO string — defaults to 1hr after start
    }
    variant?:   'outline' | 'default' | 'ghost'
    className?: string
    iconOnly?:  boolean
}

function toCalendarDate(iso: string): string {
    // GOOGLE/OUTLOOK FORMAT: YYYYMMDDTHHmmssZ
    return new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function getEndDate(startIso: string, endIso?: string): string {
    if (endIso) return toCalendarDate(endIso)
    // DEFAULT TO 1 HOUR AFTER START IF NO END DATE PROVIDED
    const end = new Date(new Date(startIso).getTime() + 60 * 60 * 1000)
    return toCalendarDate(end.toISOString())
}

function buildGoogleUrl(event: AddToCalendarButtonProps['event']): string {
    const params = new URLSearchParams({
        action:   'TEMPLATE',
        text:     event.title,
        dates:    `${toCalendarDate(event.startDate)}/${getEndDate(event.startDate, event.endDate)}`,
        details:  event.description ?? '',
        location: event.location ?? '',
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function buildOutlookUrl(event: AddToCalendarButtonProps['event']): string {
    const params = new URLSearchParams({
        path:      '/calendar/action/compose',
        rru:       'addevent',
        subject:   event.title,
        startdt:   event.startDate,
        enddt:     event.endDate ?? new Date(new Date(event.startDate).getTime() + 60 * 60 * 1000).toISOString(),
        body:      event.description ?? '',
        location:  event.location ?? '',
    })
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

function buildAppleUrl(event: AddToCalendarButtonProps['event']): string {
    // APPLE CALENDAR USES A .ics FILE DOWNLOAD — WORKS ON ALL APPLE DEVICES
    const start  = toCalendarDate(event.startDate)
    const end    = getEndDate(event.startDate, event.endDate)
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${event.title}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `DESCRIPTION:${event.description ?? ''}`,
        `LOCATION:${event.location ?? ''}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    return URL.createObjectURL(blob)
}

const CALENDAR_OPTIONS = [
    {
        label: 'Google Calendar',
        icon:  'logos:google-calendar',
        getUrl: buildGoogleUrl,
        target: '_blank' as const,
        download: false,
    },
    {
        label: 'Outlook',
        icon:  'vscode-icons:file-type-outlook',
        getUrl: buildOutlookUrl,
        target: '_blank' as const,
        download: false,
    },
    {
        label: 'Apple Calendar',
        icon:  'bi:apple',
        getUrl: buildAppleUrl,
        target: '_self' as const,
        download: true,   // TRIGGERS .ics DOWNLOAD FOR APPLE CALENDAR
    },
]

export default function AddToCalendarButton({
    event,
    variant   = 'outline',
    className,
    iconOnly  = false,
}: AddToCalendarButtonProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={variant}
                    className={cn(
                        'flex-1 text-secondary-8 rounded-full border border-accent-6 bg-transparent',
                        'hover:bg-accent-3 hover:border-accent-7 hover:shadow-md transition-all ease-linear duration-200',
                        className
                    )}
                >
                    <Icon icon="hugeicons:calendar-add-01" width="24" height="24" />
                    {!iconOnly && <span>Add to calendar</span>}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-48 p-1.5 rounded-2xl" align="start">
                <ul className="space-y-0.5">
                    {CALENDAR_OPTIONS.map(({ label, icon, getUrl, target, download }) => (
                        <li key={label}>
                            <Link
                                href={getUrl(event)}
                                target={target}
                                rel="noopener noreferrer"
                                download={download ? `${event.title}.ics` : undefined}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-secondary-8 hover:bg-accent-2 transition-colors"
                            >
                                <Icon icon={icon} width="18" height="18" />
                                <span>{label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    )
}
"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface LiquidTabsProps {
    value: string
    onValueChange: (value: string) => void
    options: { label: string; value: string }[]
    className?: string
}

function useSpring() {
    const posRef = useRef(0)
    const velRef = useRef(0)
    const rafRef = useRef<number | null>(null)
    const lastRef = useRef<number | null>(null)

    const animateTo = (target: number, onUpdate: (x: number) => void) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        lastRef.current = null

        const STIFFNESS = 200
        const DAMPING = 20
        const MASS = 1

        const step = (ts: number) => {
            if (!lastRef.current) lastRef.current = ts
            const dt = Math.min((ts - lastRef.current) / 1000, 0.032)
            lastRef.current = ts

            const force = -STIFFNESS * (posRef.current - target) - DAMPING * velRef.current
            velRef.current += (force / MASS) * dt
            posRef.current += velRef.current * dt

            onUpdate(posRef.current)

            if (Math.abs(posRef.current - target) > 0.08 || Math.abs(velRef.current) > 0.08) {
                rafRef.current = requestAnimationFrame(step)
            } else {
                posRef.current = target
                onUpdate(target)
            }
        }
        rafRef.current = requestAnimationFrame(step)
    }

    const setPos = (x: number) => { posRef.current = x }

    useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

    return { animateTo, setPos, posRef }
}

export default function LiquidTabs({ value, onValueChange, options, className }: LiquidTabsProps) {
    const pillRef = useRef<HTMLSpanElement>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const activeIdx = options.findIndex(o => o.value === value)
    const prevIdx = useRef(activeIdx)
    const { animateTo, setPos, posRef } = useSpring()

    const getPillWidth = () => {
        if (!wrapRef.current) return 0
        return (wrapRef.current.offsetWidth - 10) / options.length
    }

    // set initial pos on mount
    useEffect(() => {
        const w = getPillWidth()
        const x = activeIdx * w
        setPos(x)
        if (pillRef.current) pillRef.current.style.transform = `translateX(${x}px)`
    }, [])

    // animate on value change
    useEffect(() => {
        const w = getPillWidth()
        const to = activeIdx * w
        animateTo(to, (x) => {
            if (pillRef.current) pillRef.current.style.transform = `translateX(${x}px)`
        })
        prevIdx.current = activeIdx
    }, [value])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, val: string) => {
        const btn = e.currentTarget
        const ripple = document.createElement("span")
        const rect = btn.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        Object.assign(ripple.style, {
            position: "absolute", borderRadius: "50%",
            width: `${size}px`, height: `${size}px`,
            left: `${e.clientX - rect.left - size / 2}px`,
            top: `${e.clientY - rect.top - size / 2}px`,
            background: "rgba(255,255,255,0.2)",
            transform: "scale(0)",
            animation: "lg-ripple 0.55s ease-out forwards",
            pointerEvents: "none",
        })
        btn.appendChild(ripple)
        ripple.addEventListener("animationend", () => ripple.remove())
        onValueChange(val)
    }

    return (
        <div
            ref={wrapRef}
            className={cn("relative grid h-[62px] p-[5px] rounded-full", className)}
            style={{
                gridTemplateColumns: `repeat(${options.length}, 1fr)`,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.45)",
                backdropFilter: "blur(30px) saturate(2.4)",
                WebkitBackdropFilter: "blur(30px) saturate(2.4)",
                boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.60), inset 0 -1.5px 0 rgba(0,0,0,0.10), 0 8px 32px rgba(0,40,120,0.20), 0 2px 8px rgba(0,0,0,0.12)",
            }}
        >
            {/* spring-animated pill */}
            <span
                ref={pillRef}
                className="absolute top-[5px] h-[calc(100%-10px)] rounded-full overflow-hidden pointer-events-none z-0"
                style={{
                    width: `calc(${100 / options.length}% - 5px)`,
                    left: "5px",
                    background: "linear-gradient(160deg, rgba(0,82,204,0.80) 0%, rgba(0,60,180,0.88) 100%)",
                    border: "1px solid rgba(255,255,255,0.42)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "inset 0 2px 0 rgba(255,255,255,0.70), inset 0 -1.5px 0 rgba(0,0,0,0.20), inset 1.5px 0 0 rgba(255,255,255,0.22), 0 4px 24px rgba(0,60,200,0.50), 0 1px 4px rgba(0,0,0,0.22)",
                }}
            >
                <span className="absolute inset-[2px] rounded-full border border-white/16 pointer-events-none" />
                <span className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[58%] h-[10px] rounded-full bg-white/58 blur-xs pointer-events-none" />
                <span className="absolute top-[11px] left-[9px] w-[6px] h-[18px] rounded-full bg-white/32 blur-[2.5px] pointer-events-none" />
            </span>

            {/* container gloss */}
            <span className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[40%] h-[8px] rounded-full bg-white/22 blur-[3px] pointer-events-none z-2" />

            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={(e) => handleClick(e, opt.value)}
                    className={cn(
                        "relative z-10 overflow-hidden rounded-full text-sm font-medium outline-none whitespace-nowrap transition-colors duration-300",
                        value === opt.value
                            ? "text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.32)]"
                            : "text-neutral-7 hover:text-neutral-8"
                    )}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}
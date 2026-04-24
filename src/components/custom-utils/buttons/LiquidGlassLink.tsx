"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

type LiquidLinkProps = {
    href?: string
    onClick?: () => void
    children: React.ReactNode
    className?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">

export default function LiquidLink({ href, onClick, children, className, ...rest }: LiquidLinkProps) {
    const linkRef = useRef<HTMLAnchorElement>(null)
    const btnRef = useRef<HTMLButtonElement>(null)
    const [hovered, setHovered] = useState(false)

    const spawnRipple = (e: React.MouseEvent<HTMLElement>) => {
        const el = (linkRef.current ?? btnRef.current) as HTMLElement
        if (!el) return
        const ripple = document.createElement("span")
        const rect = el.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        Object.assign(ripple.style, {
            position: "absolute", borderRadius: "50%",
            width: `${size}px`, height: `${size}px`,
            left: `${e.clientX - rect.left - size / 2}px`,
            top: `${e.clientY - rect.top - size / 2}px`,
            background: "rgba(255,255,255,0.22)",
            transform: "scale(0)",
            animation: "lg-ripple 0.55s ease-out forwards",
            pointerEvents: "none",
        })
        el.appendChild(ripple)
        ripple.addEventListener("animationend", () => ripple.remove())
    }

    const baseClass = cn(
        // base — never overrideable
        "relative overflow-hidden inline-flex items-center justify-center",
        "rounded-full text-white text-sm font-medium",
        "active:scale-[0.96] outline-none cursor-pointer",
        // caller overrides go after
        className
    )

    const baseStyle: React.CSSProperties = {
        background: hovered
            ? "linear-gradient(160deg, rgba(0,95,230,0.90) 0%, rgba(0,75,200,0.95) 100%)"
            : "linear-gradient(160deg, rgba(0,82,204,0.80) 0%, rgba(0,60,180,0.88) 100%)",
        border: "1px solid rgba(255,255,255,0.38)",
        backdropFilter: "blur(12px) saturate(1.8)",
        WebkitBackdropFilter: "blur(12px) saturate(1.8)",
        boxShadow: hovered
            ? "inset 0 1.5px 0 rgba(255,255,255,0.75), inset 0 -1.5px 0 rgba(0,0,0,0.18), 0 6px 28px rgba(0,60,200,0.55), 0 2px 8px rgba(0,0,0,0.22)"
            : "inset 0 1.5px 0 rgba(255,255,255,0.65), inset 0 -1.5px 0 rgba(0,0,0,0.18), inset 1.5px 0 0 rgba(255,255,255,0.20), 0 4px 20px rgba(0,60,200,0.40), 0 1px 4px rgba(0,0,0,0.18)",
        transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
    }

    const innerContent = (
        <>
            <span
                className="pointer-events-none absolute top-[4px] left-1/2 -translate-x-1/2 h-[8px] rounded-full blur-[3px] transition-all duration-200"
                style={{
                    width: hovered ? "55%" : "45%",
                    background: hovered ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.50)",
                }}
            />
            <span className="pointer-events-none absolute top-[10px] left-[8px] w-[5px] h-[14px] rounded-full bg-white/28 blur-[2px]" />
            <span className="pointer-events-none absolute inset-[2px] rounded-full border border-white/15" />
            <span className="relative z-10 inline-flex items-center [text-shadow:0_1px_4px_rgba(0,0,0,0.28)]">
                {children}
            </span>
        </>
    )

    if (href) {
        return (
            <Link
                ref={linkRef}
                href={href}
                onClick={spawnRipple}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={baseClass}
                style={baseStyle}
                {...rest}
            >
                {innerContent}
            </Link>
        )
    }

    return (
        <button
            ref={btnRef}
            type="button"
            onClick={(e) => { spawnRipple(e); onClick?.() }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={baseClass}
            style={baseStyle}
            {...rest}
        >
            {innerContent}
        </button>
    )
}
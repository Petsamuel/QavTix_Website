"use client";

import { useRef } from "react";

export default function LiquidBtn({
  onClick,
  variant = "ghost",
  children,
}: {
  onClick?: () => void;
  variant?: "ghost" | "primary";
  children: React.ReactNode;
}) {
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const ripple = document.createElement("span")
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    Object.assign(ripple.style, {
      position: "absolute",
      borderRadius: "50%",
      width: `${size}px`,
      height: `${size}px`,
      left: `${e.clientX - rect.left - size / 2}px`,
      top: `${e.clientY - rect.top - size / 2}px`,
      background: "rgba(255,255,255,0.3)",
      transform: "scale(0)",
      animation: "lg-ripple 0.55s ease-out forwards",
      pointerEvents: "none",
    })
    btn.appendChild(ripple)
    ripple.addEventListener("animationend", () => ripple.remove())
    onClick?.()
  };

  const base =
    "relative overflow-hidden w-14 h-14 rounded-full flex items-center justify-center outline-none transition-all duration-200 active:scale-[0.93]";

  const ghost = [
    "bg-white/[0.12]",
    "border border-white/45",
    "backdrop-blur-xl saturate-180",
    "shadow-[inset_0_1.5px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(0,0,0,0.08),inset_1px_0_0_rgba(255,255,255,0.2),inset_-1px_0_0_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.12)]",
    "hover:bg-white/[0.22] hover:shadow-[inset_0_1.5px_0_rgba(255,255,255,0.85),0_6px_24px_rgba(0,0,0,0.22)]",
  ].join(" ")

  const primary = [
    "bg-[linear-gradient(145deg,rgba(80,100,255,0.75),rgba(40,60,220,0.85))]",
    "border border-white/30",
    "backdrop-blur-xl saturate-180",
    "shadow-[inset_0_1.5px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.15),0_4px_20px_rgba(60,80,255,0.45),0_1px_4px_rgba(0,0,0,0.2)]",
    "hover:shadow-[inset_0_1.5px_0_rgba(255,255,255,0.7),0_6px_30px_rgba(60,80,255,0.6)]",
  ].join(" ")

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={`${base} ${variant === "primary" ? primary : ghost}`}
    >
      {/* top oval gloss */}
      <span className="pointer-events-none absolute top-[5px] left-1/2 -translate-x-1/2 w-[34px] h-[10px] rounded-full bg-white/55 blur-[2px]" />
      {/* side refraction streak */}
      <span className="pointer-events-none absolute top-[14px] left-[7px] w-[6px] h-[18px] rounded-full bg-white/30 blur-[1.5px]" />
      {/* subtle inner ring */}
      <span className="pointer-events-none absolute inset-[3px] rounded-full border border-white/18" />
      {/* icon */}
      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] text-white">
        {children}
      </span>
    </button>
  )
}
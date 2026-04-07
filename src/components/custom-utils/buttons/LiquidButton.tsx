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
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    Object.assign(ripple.style, {
      position: "absolute",
      borderRadius: "50%",
      width: `${size}px`,
      height: `${size}px`,
      left: `${e.clientX - rect.left - size / 2}px`,
      top: `${e.clientY - rect.top - size / 2}px`,
      background: variant === "primary" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.45)",
      transform: "scale(0)",
      animation: "lg-ripple 0.6s linear",
      pointerEvents: "none",
    })
    btn.appendChild(ripple)
    ripple.addEventListener("animationend", () => ripple.remove())
    onClick?.()
  }

  const base =
    "relative overflow-hidden w-14 h-14 rounded-full flex items-center justify-center outline-none transition-all duration-200 active:scale-95";

  const ghost =
    "border-[1.5px] border-white/35 bg-white/10 backdrop-blur-xl shadow-[0_4px_8px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.55)] lg:shadow-[0_4px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.55)] hover:bg-white/20";

  const primary =
    "border border-white/22 bg-[linear-gradient(145deg,#0052cc,#2c71d8,#0052cc)] shadow-[0_4px_18px_rgba(79,70,229,0.45),inset_0_1px_0_rgba(255,255,255,0.30)] hover:brightness-110 hover:shadow-[0_6px_28px_rgba(79,70,229,0.55)]";

  return (
    <button ref={btnRef} onClick={handleClick} className={`${base} ${variant === "primary" ? primary : ghost}`}>
      {/* top gloss shine */}
      <span className="pointer-events-none absolute top-[3px] left-[8px] w-[38px] h-[12px] rounded-full bg-white/25" />
      {children}
    </button>
  )
}
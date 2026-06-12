// Shared Framer Motion variants for the Help Center

export const gridVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    show: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: 'spring' as const, stiffness: 130, damping: 18 },
    },
    exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.12 } },
}

export const slideIn = {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 26 } },
    exit: { opacity: 0, x: 32, transition: { duration: 0.16 } },
}

export const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 180, damping: 22 } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.1 } },
}

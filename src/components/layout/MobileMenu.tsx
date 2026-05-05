'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NAV_LINKS, navLinksMobileMenu } from '@/components-data/navigation/navLinks'
import SearchInput1 from '../custom-utils/inputs/event-search/SearchInput1'
import Logo from './Logo'
import logoSrc from "@/public-assets/logo/qavtix-logo.png"
import { Icon } from '@iconify/react'
import { space_grotesk } from '@/lib/fonts'
import { useAppSelector } from '@/lib/redux/hooks'
import CustomAvatar from '../custom-utils/avatars/CustomAvatar'
import { useLogOut } from '@/contexts/UseLogout'
import LiquidLink from '../custom-utils/buttons/LiquidGlassLink'


export default function MobileMenu({
    openMobileMenu,
    setOpenMobileMenu
}: {
    openMobileMenu: boolean
    setOpenMobileMenu: (v: boolean) => void
}) {

    const { handleLogOut, isLoggingOut } = useLogOut()
    const pathname = usePathname()

    const { isAuthenticated, user } = useAppSelector(store => store.auth)

    const isActive = (href: string) => {
        if (href === '/') return pathname === href
        return pathname.startsWith(href)
    }

    const handleClose = () => {
        setOpenMobileMenu(false)
    }

    useEffect(() => {
        if (openMobileMenu) {
            handleClose()
        }
    }, [pathname])


    useEffect(() => {
        if (openMobileMenu) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [openMobileMenu])


    return (
        <AnimatePresence mode="wait">
            {openMobileMenu && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                        onClick={handleClose}
                    />

                    {/* Menu Panel */}
                    <motion.div
                        key="menu-panel"
                        initial={{
                            x: '-100%'
                        }}
                        animate={{
                            x: 0,
                            transition: {
                                type: 'tween',
                                damping: 30,
                                stiffness: 300,
                                duration: 0.4
                            }
                        }}
                        exit={{
                            x: '-100%',
                            transition: {
                                type: 'tween',
                                damping: 30,
                                stiffness: 300,
                                duration: 0.3
                            }
                        }}
                        className="fixed top-0 left-0 bottom-0 w-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center gap-8">
                                <Logo logo={logoSrc} />

                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{
                                        y: 0,
                                        opacity: 1,
                                        transition: { delay: 0.1, duration: 0.3 }
                                    }}
                                    exit={{
                                        y: -20,
                                        opacity: 0,
                                        transition: { duration: 0.2 }
                                    }}
                                    className="hidden md:block"
                                >
                                    <SearchInput1 />
                                </motion.div>


                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-neutral-2 rounded-full transition-colors"
                                    aria-label="Close menu"
                                >
                                    <Icon icon="codicon:close" width="22" height="22" className="text-neutral-8" />
                                </button>
                            </div>

                            {/* Search Input */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    transition: { delay: 0.1, duration: 0.3 }
                                }}
                                exit={{
                                    y: -20,
                                    opacity: 0,
                                    transition: { duration: 0.2 }
                                }}
                                className="flex justify-center items-center mt-12 md:hidden"
                            >
                                <SearchInput1 />
                            </motion.div>

                            {/* Navigation Links */}
                            <nav className="space-y-1 mt-10 mb-6">
                                {navLinksMobileMenu.map((link, index) => {
                                    const active = isActive(link.href)

                                    if (link.href.includes("dashboard") && !isAuthenticated) return null;

                                    return (
                                        <motion.div
                                            key={link.href}
                                            initial={{
                                                x: -30,
                                                opacity: 0
                                            }}
                                            animate={{
                                                x: 0,
                                                opacity: 1,
                                                transition: {
                                                    delay: 0.15 + (index * 0.04),
                                                    duration: 0.4,
                                                    ease: 'easeOut'
                                                }
                                            }}
                                            exit={{
                                                x: -30,
                                                opacity: 0,
                                                transition: {
                                                    delay: (navLinksMobileMenu.length - index - 1) * 0.03,
                                                    duration: 0.2,
                                                    ease: 'easeIn'
                                                }
                                            }}
                                        >
                                            <Link
                                                href={link.href}
                                                className={`${space_grotesk.className}
                                                    block px-4 py-3 rounded-lg font-normal text-[15px] transition-all
                                                    ${active
                                                        ? 'bg-primary-1 text-primary-7 font-medium'
                                                        : 'text-secondary-9 hover:bg-neutral-2'
                                                    }
                                                    active:scale-[0.98]
                                                `}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </nav>


                            {
                                isAuthenticated && user?.id ?
                                    <div className="flex mx-3 mb-3 items-center gap-1">
                                        <CustomAvatar id={user.id} profileImg={user.profile_picture} name={user.full_name} size="size-7 ring-2!" textSize="text-base" />

                                        <div className="flex flex-col gap-2">
                                            <span className="text-xs font-medium text-neutral-8">
                                                {user.full_name}
                                            </span>
                                            <button
                                                onClick={handleLogOut}
                                                disabled={isLoggingOut}
                                                className="flex items-center gap-1 text-xs text-secondary-4 hover:text-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
                                            >
                                                {isLoggingOut
                                                    ? <><Icon icon="eos-icons:three-dots-loading" className="size-3" /> Signing out</>
                                                    : "Sign out"
                                                }
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{
                                            y: 0,
                                            opacity: 1,
                                            transition: { delay: 0.4, duration: 0.3 }
                                        }}
                                        exit={{
                                            y: 20,
                                            opacity: 0,
                                            transition: { duration: 0.2 }
                                        }}
                                        className="p-4 flex items-center gap-4 border-t border-neutral-3"
                                    >
                                        <Link
                                            href={`${NAV_LINKS.SIGN_IN.href}`}
                                            className="font-semibold text-neutral-8 hover:text-primary transition-colors"
                                        >
                                            Sign in
                                        </Link>
                                        <LiquidLink
                                            href={`${NAV_LINKS.SIGN_UP.href}`}
                                            className="w-fit px-6 py-3 rounded-full text-center font-medium bg-primary text-white hover:bg-primary-7 active:scale-[0.98] transition-all shadow-md"
                                        >
                                            Get started
                                        </LiquidLink>
                                    </motion.div>
                            }
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
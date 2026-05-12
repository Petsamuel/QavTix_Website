import { inter } from "@/lib/fonts"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { siteMetadata, siteViewport } from "@/metadata"
import { Suspense } from "react"
import LayoutDataProvider from "@/components/layout/LayoutDataProvider"

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport

export default function MainRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen h-screen`} suppressHydrationWarning>
                <Suspense fallback={null}>
                    <LayoutDataProvider>
                        {children}
                    </LayoutDataProvider>
                </Suspense>
            </body>
        </html>
    )
}

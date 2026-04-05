import Image, { StaticImageData } from "next/image";
import logoSrc from "@/public-assets/logo/qavtix-logo.png"
import Link from "next/link";

export default function Logo({ width = 85, height = 45, logo = logoSrc, className }: { width?: number; height?: number, logo?: StaticImageData, className?: string }) {
    return (
        <Link href="/" className="inline-block">
            <Image src={logo} alt="Qavtix Logo" width={width} height={height} className={className} />
        </Link>
    )
}
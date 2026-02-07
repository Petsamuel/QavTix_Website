import Image from "next/image";
import logoSrc from "@/public-assets/logo/qavtix-logo.svg"
import Link from "next/link";

export default function Logo({ width = 80, height = 35, logo = logoSrc, className }: { width?: number; height?: number, logo?: string, className?: string }) {
    return (
        <Link href="/" className="inline-block">
            <Image src={logo} alt="Qavtix Logo" width={width} height={height} className={className} />
        </Link>
    )
}
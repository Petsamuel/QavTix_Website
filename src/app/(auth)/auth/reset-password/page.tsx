import ResetPasswordPageCW from "@/components/page-content-wrappers/ResetPasswordPageCW";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:  "Reset Password",
    robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
    return <ResetPasswordPageCW />
}
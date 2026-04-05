import SignInCWPage from "@/components/page-content-wrappers/SIgnInPageCW";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:  "Sign In",
    robots: { index: false, follow: false },
}

export default function SignInPage() {
    return <SignInCWPage />
}
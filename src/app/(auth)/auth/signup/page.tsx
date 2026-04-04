import SignUpPageCW from "@/components/page-content-wrappers/SignUpPageCW";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:  "Create Account",
    robots: { index: false, follow: false },
}

export default function SignUpPage(){
    return <SignUpPageCW />
}
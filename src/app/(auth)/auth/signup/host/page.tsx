import { getCategories } from "@/actions/filters";
import HostSignUpContent from "@/components/auth-pages/HostSignUpContent";
import { HostSignupProvider } from "@/contexts/HostSignupProvider";

export default async function HostSignupPage() {
    
    const categoriesResult = await getCategories()
    
    return (
        <HostSignupProvider categories={categoriesResult.data}>
            <HostSignUpContent />
        </HostSignupProvider>
    )
}
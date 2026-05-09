// AuthPageFlexWrapper.tsx
import Logo from "../layout/Logo";
import AuthPageImageCarousel from "./AuthPageImageCarousel";

export default function AuthPageFlexWrapper({ children, contentSectionMaxWidth = "md:max-w-xl" }: { children: React.ReactNode, contentSectionMaxWidth?: string }) {
    return (
        <div className="min-h-screen bg-white global-px py-4 md:py-6">
            {/* Mobile Logo */}
            <div className="flex lg:hidden justify-center items-center h-20 mb-8 md:mb-14">
                <Logo />
            </div>

            <div className="flex flex-col lg:flex-row justify-between min-h-screen">
                <div className={`relative z-10 md:pb-6 w-full md:mx-auto lg:max-w-[unset] lg:mx-[unset] lg:pb-0 lg:w-[49%] lg:ps-14 ${contentSectionMaxWidth}`}>
                    {/* Large Screen Logo */}
                    <div className="hidden lg:flex justify-center mb-20 mt-5">
                        <Logo />
                    </div>
                    {children}
                </div>

                <div className="hidden lg:block w-full lg:w-[45%] relative">
                    <div className="fixed right-16 w-[40vw] h-[97vh] my-auto top-0 bottom-0">
                        <AuthPageImageCarousel />
                    </div>
                </div>
            </div>
        </div>
    )
}
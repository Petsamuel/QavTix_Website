"use client"

import { contactHostSchema, ContactHostSchema } from "@/schemas/contact-host.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import FormInput2 from "@/components/custom-utils/inputs/FormInput2"
import FormTextarea1 from "@/components/custom-utils/inputs/FormTextarea1"
import ActionButton1 from "@/components/custom-utils/buttons/ActionButton1"
import { contactHost } from "@/actions/host"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"


interface Props {
    event: EventDetails
}

export default function ContactHostForm({ event }: Props) {

    const dispatch = useAppDispatch()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactHostSchema>({
        resolver: zodResolver(contactHostSchema),
    })

    const onSubmit = async (data: ContactHostSchema) => {
        const result = await contactHost({
            full_name: data.fullName,
            email:     data.email,
            message:   data.message,
            host:      event.organizer_id,
        })

        if (result.success) {
            dispatch(showAlert({
                variant:     "success",
                title:       "Message sent!",
                description: "The host will get back to you shortly.",
            }))
            reset()
        } else {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Failed to send",
                description: result.message ?? "Something went wrong. Please try again.",
            }))
        }
    }

    const socialPlatformIcon = (url: string) => {
        if (url.includes("twitter") || url.includes("x.com")) return "hugeicons:new-twitter"
        if (url.includes("instagram"))                         return "hugeicons:instagram"
        if (url.includes("facebook"))                          return "fa6-brands:facebook"
        if (url.includes("tiktok"))                            return "ic:baseline-tiktok"
        if (url.includes("youtube"))                           return "mynaui:youtube-solid"
        return "humbleicons:globe"
    }

    return (
        <div>
            <h3 className={cn(space_grotesk.className, "text-secondary-9 font-medium mt-10 mb-4")}>
                Contact the host
            </h3>

            <div className="flex gap-4 mt-6 mb-10">
                {event.social_links.map(social => (
                    <Link
                        key={social.url}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center hover:scale-110 transition-transform"
                        aria-label={social.url.includes("twitter") || social.url.includes("x.com") ? "Twitter" :
                                    social.url.includes("instagram") ? "Instagram" :
                                    social.url.includes("facebook") ? "Facebook" : "Social Media"}
                    >
                        <Icon icon={socialPlatformIcon(social.url)} width="24" height="24" className="text-secondary-9 size-9" />
                    </Link>
                ))}
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 mb-10 md:max-w-sm"
                data-testid="contact-host-form"
            >
                <div className="space-y-5 sm:grid grid-cols-2 gap-4 md:grid-cols-1">
                    <FormInput2
                        label="Full name"
                        placeholder="Enter your first and last name"
                        required
                        {...register('fullName')}
                        error={errors.fullName?.message}
                        data-testid="contact-host-name"
                    />
                    <FormInput2
                        label="Email address"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        {...register('email')}
                        error={errors.email?.message}
                        data-testid="contact-host-email"
                    />
                </div>

                <FormTextarea1
                    label="Message"
                    placeholder="Write your message to the host..."
                    className="h-[15em] w-full"
                    required
                    {...register('message')}
                    error={errors.message?.message}
                    data-testid="contact-host-message"
                />

                <ActionButton1
                    buttonText={isSubmitting ? "Sending..." : "Send Message"}
                    className="w-full mt-6"
                    icon={isSubmitting ? "eos-icons:three-dots-loading" : "lucide:send-horizontal"}
                    iconPosition="right"
                    buttonType="submit"
                    isDisabled={isSubmitting}
                    isLoading={isSubmitting}
                    data-testid="contact-host-submit"
                />
            </form>
        </div>
    )
}
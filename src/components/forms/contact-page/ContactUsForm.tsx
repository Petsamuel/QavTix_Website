"use client"

import { NAV_LINKS } from "@/components-data/navigation/navLinks";
import ActionButton1 from "@/components/custom-utils/buttons/ActionButton1";
import FormInput2 from "@/components/custom-utils/inputs/FormInput2";
import FormTextarea1 from "@/components/custom-utils/inputs/FormTextarea1";
import { space_grotesk } from "@/lib/fonts";
import { contactUsSchema, ContactUsSchema } from "@/schemas/contact-us.schema";
import { sendContactEmail } from "@/actions/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/lib/redux/hooks";
import { showAlert } from "@/lib/redux/slices/alertSlice";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ContactUsForm(){

    const dispatch = useAppDispatch()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ContactUsSchema>({
        resolver: zodResolver(contactUsSchema),
    })


    const handleContactFormSubmit : SubmitHandler<ContactUsSchema> = async (data) => {
        const result = await sendContactEmail({
            name: data.fullName,
            email: data.email,
            message: data.message,
        })

        if (result.success) {
            dispatch(showAlert({
                title: "Message sent!",
                description: "We\'ve received your message and will redirect you to Gmail to finalize.",
                variant: "success",
            }))
            
            // Construct Gmail URL
            const subject = encodeURIComponent(`Message from ${data.fullName} via QavTix Contact Form`)
            const body = encodeURIComponent(`Name: ${data.fullName}\nEmail: ${data.email}\n\nMessage:\n${data.message}`)
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@qavtix.com&su=${subject}&body=${body}`
            
            window.open(gmailUrl, '_blank')
            reset()
        } else {
            dispatch(showAlert({
                title: "Failed to send message",
                description: result.message ?? "Something went wrong. Please try again.",
                variant: "destructive",
            }))
        }
    }

    return (
        <section>
            <div className="rounded-3xl p-6 bg-accent-1">
                <h3 className={`text-secondary-9 text-2xl font-medium leading-8 ${space_grotesk.className}`}>Send us a message</h3>
                <p className="text-neutral-8 mt-5">
                    Before getting in touch see some <Link href={NAV_LINKS.FAQ.href} className="text-accent-6 font-medium">frequently asked questions</Link> to clarify your objections and get answers to your questions.
                </p>
            </div>

            <form onSubmit={handleSubmit(handleContactFormSubmit)} className="space-y-5 mb-10 py-12">
                <div className="space-y-5 sm:grid grid-cols-2 gap-4 md:grid-cols-1">
                    <FormInput2
                        label="Full name"
                        placeholder="e.g. Jon Doe"
                        required
                        className="border-none! bg-neutral-3!"
                        {...register('fullName')}
                        error={errors.fullName?.message}
                    />

                    <FormInput2
                        label="Email address"
                        type="email"
                        placeholder="e.g. Jon.Doe@gmail.com"
                        required
                        className="border-none! bg-neutral-3!"
                        {...register('email')}
                        error={errors.email?.message}
                    />
                </div>

                <FormTextarea1
                    label="Message"
                    placeholder="Your message description"
                    className="h-[17em] lg:h-80 w-full border-none! bg-neutral-3!"
                    required
                    {...register('message')}
                    error={errors.message?.message}
                />

                <ActionButton1 
                    buttonText={isSubmitting ? "Sending…" : "Send Message"} 
                    buttonType="submit"
                    className="w-full mt-6"  
                    icon={isSubmitting ? undefined : "lucide:send-horizontal"} 
                    iconPosition="right"
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}
                />
            </form>
        </section>
    )
}
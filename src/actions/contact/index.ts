"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: {
    name: string
    email: string
    message: string
}) {
    try {
        await resend.emails.send({
            from: "Contact Form <onboarding@resend.dev>",
            to: process.env.YOUR_EMAIL!,
            subject: `New message from ${formData.name}`,
            html: `
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Message:</strong> ${formData.message}</p>
            `,
        })
        return { success: true }
    } catch (error) {
        console.error("[sendContactEmail]", error)
        return { success: false, message: "Failed to send email. Please try again later." }
    }
}

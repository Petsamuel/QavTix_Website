"use server"

import { CANCEL_TICKET_ENDPOINT, CHECKOUT_ENDPOINT, CHECKOUT_VERIFY_ENDPOINT, SPLIT_PAYMENT_TOKEN_CHECKOUT_ENDPOINT, SPLIT_PAYMENT_TOKEN_VERIFY_ENDPOINT, VALIDATE_PROMO_CODE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { getEventDetails } from "../getters"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"


interface InitializePaymentResult {
    success:      boolean
    checkout_url?: string
    message?:     string
}

interface VerifyPaymentPayload {
    reference: string
    save_card: boolean
    country:   string
}

interface VerifyPaymentResult {
    success:  boolean
    data?:    {
        flow:           string
        order_id:       string
        status:         string
        split_complete: boolean
        paid_count:     number
        total:          number
    }
    message?: string
}


export async function initializePayment(
    payload: InitializePaymentPayload
): Promise<InitializePaymentResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data: json } = await axiosInstance.post(CHECKOUT_ENDPOINT, payload)

        const checkout_url = json.data?.checkout_url ?? json.checkout_url
        if (!checkout_url) {
            return { success: false, message: "No checkout URL returned from server." }
        }

        return { success: true, checkout_url }

    } catch (error: any) {
        console.log("[initializePayment] status:", error?.response?.status)
        console.log("[initializePayment] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function verifyPayment(
    payload: VerifyPaymentPayload
): Promise<VerifyPaymentResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data: json } = await axiosInstance.post(CHECKOUT_VERIFY_ENDPOINT, payload)

        return { success: true, data: json.data ?? json }

    } catch (error: any) {
        console.log("[verifyPayment] status:", error?.response?.status)
        console.log("[verifyPayment] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}




interface ValidatePromoCodePayload {
    code:     string
    event_id: string
}

interface ValidatePromoCodeResult {
    success:  boolean
    data?:    {
        type:        string
        code:        string
        percentage?: number
        amount?:     number
        description: string
    }
    message?: string
}

export async function validatePromoCode(
    payload: ValidatePromoCodePayload
): Promise<ValidatePromoCodeResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data: json } = await axiosInstance.post(VALIDATE_PROMO_CODE_ENDPOINT, payload)

        return { success: true, data: json.data ?? json }

    } catch (error: any) {
        console.log("[validatePromoCode] status:", error?.response?.status)
        console.log("[validatePromoCode] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}


export async function canRestartCheckout(eventID: string) {
    const result = await getEventDetails(eventID)

    if (result.success && result.data?.tickets.length) {
        return true;
    } else {
        return false;
    }
}

interface SplitPaymentTokenResult {
    success: boolean
    data?: any
    checkout_url?: string
    message?: string
}

export async function confirmSplitPaymentToken(token: string): Promise<SplitPaymentTokenResult> {
    try {
        const axiosInstance = await getServerAxios()
        const endpoint = SPLIT_PAYMENT_TOKEN_VERIFY_ENDPOINT.replace("[token]", token)
        const { data: json } = await axiosInstance.get(endpoint)

        return { success: true, data: json.data ?? json }

    } catch (error: any) {
        const status = error?.response?.status
        let message = handleApiError(error?.response?.data)

        if (status === 400) {
            message = "Already paid or expired"
        } else if (status === 404) {
            message = "Invalid token"
        }

        console.log("[confirmSplitPaymentToken] status:", status)
        console.log("[confirmSplitPaymentToken] body:", JSON.stringify(error?.response?.data))

        return { success: false, message }
    }
}

export async function checkoutFromSplitPaymentToken(token: string): Promise<SplitPaymentTokenResult> {
    try {
        const axiosInstance = await getServerAxios()
        const endpoint = SPLIT_PAYMENT_TOKEN_CHECKOUT_ENDPOINT.replace("[token]", token)
        const { data: json } = await axiosInstance.post(endpoint, { token })

        const checkout_url = json.data?.checkout_url ?? json.checkout_url
        if (!checkout_url) {
            return { success: false, message: "No checkout URL returned from server." }
        }

        return { success: true, checkout_url }

    } catch (error: any) {
        const status = error?.response?.status
        let message = handleApiError(error?.response?.data)

        if (status === 400) {
            message = "Already paid or expired"
        } else if (status === 404) {
            message = "Invalid token"
        }

        console.log("[checkoutFromSplitPaymentToken] status:", status)
        console.log("[checkoutFromSplitPaymentToken] body:", JSON.stringify(error?.response?.data))

        return { success: false, message }
    }
}


interface CancelTicketResult {
    success:    boolean
    message?:   string
    failedIDs?: string[]
}

export async function cancelTickets(ticketIDs: string[]): Promise<CancelTicketResult> {
    const failedIDs: string[] = []

    for (const ticketID of ticketIDs) {
        try {
            const axiosInstance = await getServerAxios()
            await axiosInstance.post(
                CANCEL_TICKET_ENDPOINT.replace("[ticket_id]", ticketID)
            )
        } catch (error: any) {
            console.log("[cancelTickets] failed for", ticketID, "status:", error?.response?.status)
            console.log("[cancelTickets] body:", JSON.stringify(error?.response?.data))
            failedIDs.push(ticketID)
        }
    }

    if (failedIDs.length === 0) {
        return { success: true }
    }

    if (failedIDs.length === ticketIDs.length) {
        return { success: false, message: "Failed to cancel all selected tickets. Please try again." }
    }

    revalidateTag(CACHE_TAGS.EVENT_DETAILS, "max")

    return {
        success: false,
        message: `${ticketIDs.length - failedIDs.length} ticket(s) cancelled. ${failedIDs.length} could not be cancelled.`,
        failedIDs,
    }
}
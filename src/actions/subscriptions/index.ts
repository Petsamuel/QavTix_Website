"use server"

import { ATTENDEE_CHECKOUT_VERIFY_ENDPOINT, ATTENDEE_PLAN_CHECKOUT_ENDPOINT, HOST_PLAN_CHECKOUT_ENDPOINT, HOST_PLAN_CHECKOUT_VERIFY_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"

// INITIALIZE A SUBSCRIPTION PAYMENT FOR A HOST
// RETURNS A CHECKOUT URL CONTAINING THE PAYSTACK ACCESS CODE
export async function initializeHostSubscription(payload: {
    plan_slug:      string
    billing_cycle:  "monthly" | "annual"
    country:        string
    currency:       string
}): Promise<{ success: boolean; checkout_url?: string; message?: string }> {
    try {
        const axiosInstance = await getServerAxios("host_access_token")

        const { data } = await axiosInstance.post(HOST_PLAN_CHECKOUT_ENDPOINT, payload)

        const checkout_url = data?.checkout_url ?? data?.data?.checkout_url

        if (!checkout_url) {
            return { 
                success: false, 
                message: "No checkout URL returned from server." 
            }
        }

        return { success: true, checkout_url }

    } catch (error: any) {
        console.error("[initializeHostSubscription] error:", error?.response?.data || error)
        
        const status = error?.response?.status
        return {
            success: false,
            message: status 
                ? mapSubscriptionError(status) 
                : "Network error. Please try again."
        }
    }
}

// VERIFY A COMPLETED HOST SUBSCRIPTION PAYMENT
export async function verifyHostSubscription(payload: {
    reference:  string
    save_card:  boolean
    country:    string
}): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
        const axiosInstance = await getServerAxios("host_access_token")

        const { data } = await axiosInstance.post(HOST_PLAN_CHECKOUT_VERIFY_ENDPOINT, payload)

        return { 
            success: true, 
            message: data?.message,
            data: data?.data ?? data 
        }

    } catch (error: any) {
        console.error("[verifyHostSubscription] error:", error?.response?.data || error)
        
        return {
            success: false,
            message: error?.response?.data?.message ?? "Verification failed. Please contact support."
        }
    }
}

// INITIALIZE A SUBSCRIPTION PAYMENT FOR AN ATTENDEE
export async function initializeAttendeeSubscription(payload: {
    plan_slug:      string
    billing_cycle:  "monthly" | "annual"
    currency:       string
}): Promise<{ success: boolean; checkout_url?: string; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()

        const { data } = await axiosInstance.post(ATTENDEE_PLAN_CHECKOUT_ENDPOINT, payload)

        const checkout_url = data?.checkout_url ?? data?.data?.checkout_url

        if (!checkout_url) {
            return { 
                success: false, 
                message: "No checkout URL returned from server." 
            }
        }

        return { success: true, checkout_url }

    } catch (error: any) {
        console.error("[initializeAttendeeSubscription] error:", error?.response?.data || error)
        
        const status = error?.response?.status
        return {
            success: false,
            message: status 
                ? mapSubscriptionError(status) 
                : "Network error. Please try again."
        }
    }
}

// VERIFY A COMPLETED ATTENDEE SUBSCRIPTION PAYMENT
export async function verifyAttendeeSubscription(payload: {
    reference:  string
    save_card:  boolean
    country:    string
}): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
        const axiosInstance = await getServerAxios()

        const { data } = await axiosInstance.post(ATTENDEE_CHECKOUT_VERIFY_ENDPOINT, payload)

        return { 
            success: true, 
            message: data?.message,
            data: data?.data ?? data 
        }

    } catch (error: any) {
        console.error("[verifyAttendeeSubscription] error:", error?.response?.data || error)
        
        return {
            success: false,
            message: error?.response?.data?.message ?? "Verification failed. Please contact support."
        }
    }
}

// MAPS HTTP STATUS CODES TO HUMAN-READABLE MESSAGES
function mapSubscriptionError(status: number): string {
    switch (status) {
        case 400: return "You are already on this plan or this would be a downgrade."
        case 402: return "Your card charge failed. Please check your payment details."
        case 403: return "Your account type is not eligible for this plan."
        case 404: return "Plan not found. Please refresh and try again."
        default:  return "Something went wrong. Please try again."
    }
}
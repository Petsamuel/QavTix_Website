"use server"

import { CACHE_TAGS } from "@/cache-tags"
import { ADD_FAVOURITE_ENDPOINT, REMOVE_FAVOURITE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"

interface MutateFavouriteResult {
    success:  boolean
    message?: string
}

export async function addFavourite(eventId: string | number): Promise<MutateFavouriteResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(ADD_FAVOURITE_ENDPOINT, { event_id: eventId })
        revalidateTag(CACHE_TAGS.EVENT_CARDS, 'max')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function removeFavourite(eventId: string | number): Promise<MutateFavouriteResult> {
    try {
        const axiosInstance = await getServerAxios()
        const endpoint = REMOVE_FAVOURITE_ENDPOINT.replace("[event_id]", String(eventId))
        await axiosInstance.delete(endpoint)
        revalidateTag(CACHE_TAGS.EVENT_CARDS, 'max')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

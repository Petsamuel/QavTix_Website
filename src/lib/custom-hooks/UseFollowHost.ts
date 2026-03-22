"use client"

import { useRef, useState } from "react"
import { followHost, unfollowHost } from "@/actions/host"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { showAuthPrompt } from "../redux/slices/showAuthPromptSlice"

export function useFollowHost(hostId: number | string, initialState = false) {

    const dispatch = useAppDispatch()
    const { isAuthenticated } = useAppSelector(store => store.auth)

    const [isFollowing, setIsFollowing] = useState(initialState)
    const isPending = useRef(false)

    const toggle = async () => {
        if (!isAuthenticated) {
            dispatch(showAuthPrompt("Sign in to follow and get updates from this host"))
            return
        }

        if (isPending.current) return
        isPending.current = true

        const snapshot = isFollowing
        setIsFollowing(!snapshot)  // optimistic

        const result = snapshot
            ? await unfollowHost(hostId)
            : await followHost(hostId)

        if (!result.success) {
            setIsFollowing(snapshot)  // revert
            dispatch(showAlert({
                variant:     "destructive",
                title:       snapshot ? "Could not unfollow" : "Could not follow",
                description: result.message ?? "Please try again.",
            }))
        }

        isPending.current = false
    }

    return { isFollowing, toggle }
}
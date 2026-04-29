"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { followHost, unfollowHost } from "@/actions/host"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { showAuthPrompt } from "../redux/slices/showAuthPromptSlice"

export function useFollowHost(
    hostId: number | string,
    initialState = false,
    initialFollowersCount = 0,
) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { isAuthenticated } = useAppSelector(store => store.auth)

    const [isFollowing, setIsFollowing] = useState(initialState)
    const [followersCount, setFollowersCount] = useState(initialFollowersCount)
    const [isPending, setIsPending] = useState(false)
    const pendingRef = useRef(false)

    const toggle = async () => {
        if (!isAuthenticated) {
            dispatch(showAuthPrompt("Sign in to follow and get updates from this host"))
            return
        }
        if (pendingRef.current) return
        pendingRef.current = true
        setIsPending(true)

        const wasFollowing = isFollowing

        // Optimistic update
        setIsFollowing(!wasFollowing)
        setFollowersCount(prev => wasFollowing ? Math.max(0, prev - 1) : prev + 1)

        const result = wasFollowing
            ? await unfollowHost(hostId)
            : await followHost(hostId)

        if (!result.success) {
            // Revert
            setIsFollowing(wasFollowing)
            setFollowersCount(prev => wasFollowing ? prev + 1 : Math.max(0, prev - 1))
            dispatch(showAlert({
                variant: "destructive",
                title: wasFollowing ? "Could not unfollow" : "Could not follow",
                description: result.message ?? "Please try again.",
            }))
        } else {
            router.refresh()
        }

        pendingRef.current = false
        setIsPending(false)
    }

    return { isFollowing, followersCount, isPending, toggle }
}
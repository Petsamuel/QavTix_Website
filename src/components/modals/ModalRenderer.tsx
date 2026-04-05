"use client"

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import AuthPromptModal from "./AuthPromptModal";
import PopUpMessageAlertModal from "./PopUpMessageAlert";
import { useEffect } from "react";
import { triggerPopupAlert } from "@/lib/redux/slices/popupAlertSlice";
import { PROFILE_INCOMPLETE_ALERT } from "./resources/popup-message-alert-config";
import { usePathname } from "next/navigation";

export default function ModalRenderer(){

    const { isAuthenticated, user } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const pathName = usePathname()
    
    useEffect(() => {
        if (!user?.is_completed && isAuthenticated && !pathName.includes("/profile") && !pathName.includes("/auth")) {
            dispatch(triggerPopupAlert(PROFILE_INCOMPLETE_ALERT))
        }
    },[user?.id, user?.is_completed, isAuthenticated, pathName])

    return (
        <>
            <AuthPromptModal />
            <PopUpMessageAlertModal />
        </>
    )
}
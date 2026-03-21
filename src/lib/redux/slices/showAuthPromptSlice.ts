import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthPromptState {
    isOpen:  boolean
    message: string
}

const initialState: AuthPromptState = {
    isOpen:  false,
    message: "Sign in to continue",
}

const authPromptSlice = createSlice({
    name: "authPrompt",
    initialState,
    reducers: {
        showAuthPrompt: (state, action: PayloadAction<string | undefined>) => {
            state.isOpen  = true
            state.message = action.payload ?? "Sign in to continue"
        },
        hideAuthPrompt: (state) => {
            state.isOpen = false
        },
    },
})

export const { showAuthPrompt, hideAuthPrompt } = authPromptSlice.actions
export default authPromptSlice.reducer;
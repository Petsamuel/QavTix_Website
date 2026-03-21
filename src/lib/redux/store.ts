import { configureStore } from '@reduxjs/toolkit'
import alertReducer from "./slices/alertSlice"
import authReducer from "./slices/authUserSlice"
import authPromptReducer from "./slices/showAuthPromptSlice"
import settingsReducer from "./slices/settingsSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      alert: alertReducer,
      settings: settingsReducer,
      auth: authReducer,
      authPrompt: authPromptReducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']
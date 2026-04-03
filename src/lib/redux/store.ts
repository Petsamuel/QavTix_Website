import { configureStore } from '@reduxjs/toolkit'
import alertReducer from "./slices/alertSlice"
import authReducer from "./slices/authUserSlice"
import authPromptReducer from "./slices/showAuthPromptSlice"
import settingsReducer from "./slices/settingsSlice"
import popUpReducer from "./slices/popupAlertSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      alert: alertReducer,
      settings: settingsReducer,
      auth: authReducer,
      authPrompt: authPromptReducer,
      popupAlert: popUpReducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import {
  IndividualGeneralData,
  OrganizationGeneralData,
  IndividualBusinessData,
  OrganizationBusinessData,
  PasswordData,
  } from '@/schemas/host-signup.schema'
  import { ApiCategory } from '@/actions/filters'

  type HostSignupFormData =
  | Partial<IndividualGeneralData>
  | Partial<IndividualBusinessData>
  | Partial<OrganizationGeneralData>
  | Partial<OrganizationBusinessData>
  | Partial<PasswordData>
  | Record<string, never>

  type SignupContextType = {
    currentStep:         number
    signUpSuccessful:    boolean
    formData:            HostSignupFormData
    categories:          ApiCategory[]
    setCurrentStep:      (step: number) => void
    setSignUpSuccessful: (value: boolean) => void
    updateFormData:      (data: Partial<HostSignupFormData>) => void
    nextStep:            () => void
    prevStep:            () => void
    resetForm:           () => void
  }

  const SignupContext = createContext<SignupContextType | undefined>(undefined)

  interface Props {
    children:   ReactNode
    categories: ApiCategory[]
  }

  export function HostSignupProvider({ children, categories }: Props) {
  const [currentStep,      setCurrentStep]      = useState(1)
  const [signUpSuccessful, setSignUpSuccessful] = useState(false)
  const [formData, setFormData] = useState<HostSignupFormData>({
    state:         "",
    country:       "",
    agreedToTerms: false,
  })

  const updateFormData = (data: Partial<HostSignupFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => setCurrentStep(prev => prev + 1)
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const resetForm = () => {
    setCurrentStep(1)
    setSignUpSuccessful(false)
    setFormData({})
  }

  return (
    <SignupContext.Provider value={{
      currentStep,
      signUpSuccessful,
      formData,
      categories,
      setCurrentStep,
      setSignUpSuccessful,
      updateFormData,
      nextStep,
      prevStep,
      resetForm,
    }}>
      {children}
    </SignupContext.Provider>
  )
}

export function useSignup() {
  const context = useContext(SignupContext)
  if (!context) throw new Error('useSignup must be used within HostSignupProvider')
  return context
}
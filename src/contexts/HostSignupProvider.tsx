'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import {
  IndividualGeneralData,
  OrganizationGeneralData,
  IndividualBusinessData,
  OrganizationBusinessData,
  PasswordData,
  HostAccountType,
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
  accountType:         HostAccountType
  signUpSuccessful:    boolean
  formData:            HostSignupFormData
  categories:          ApiCategory[]
  setAccountType:      (type: HostAccountType) => void
  setCurrentStep:      (step: number) => void
  setSignUpSuccessful: (value: boolean) => void
  updateFormData:      (data: Partial<HostSignupFormData>) => void
  nextStep:            () => void
  prevStep:            () => void
  resetForm:           () => void
}

const SignupContext = createContext<SignupContextType | undefined>(undefined)

interface Props {
  children:    ReactNode
  categories:  ApiCategory[]
  initialType?: HostAccountType
}

export function HostSignupProvider({ children, categories, initialType = "individual" }: Props) {
  const [currentStep,      setCurrentStep]      = useState(1)
  const [signUpSuccessful, setSignUpSuccessful] = useState(false)
  const [accountType,      setAccountTypeState] = useState<HostAccountType>(initialType)
  const [formData, setFormData] = useState<HostSignupFormData>({
    state:         "",
    country:       "",
    agreedToTerms: false,
    profileImage:  null,
    bannerImage:   null,
  })

  const updateFormData = (data: Partial<HostSignupFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const setAccountType = (type: HostAccountType) => {
    if (type === accountType) return
    setAccountTypeState(type)
    setCurrentStep(1)
    setFormData({
      state: "",
      country: "",
      agreedToTerms: false,
      profileImage: null,
      bannerImage: null
    })
  }

  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50)
  }, [currentStep])

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const resetForm = () => {
    setCurrentStep(1)
    setSignUpSuccessful(false)
    setFormData({
      state: "",
      country: "",
      agreedToTerms: false,
      profileImage: null,
      bannerImage: null
    })
  }

  return (
    <SignupContext.Provider value={{
      currentStep,
      accountType,
      signUpSuccessful,
      formData,
      categories,
      setAccountType,
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
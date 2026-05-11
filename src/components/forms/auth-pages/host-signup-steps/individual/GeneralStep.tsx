'use client'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Country, State } from 'country-state-city'
import { useSignup } from '@/contexts/HostSignupProvider'
import { individualGeneralSchema, type IndividualGeneralData } from '@/schemas/host-signup.schema'
import TextInput1 from '@/components/custom-utils/inputs/TextInput1'
import FormSelect1 from '@/components/custom-utils/inputs/FormSelect1'
import FormCheckbox1 from '@/components/custom-utils/inputs/FormCheckbox1'
import MultiStepFormButtonDuo from '@/components/custom-utils/buttons/MultiStepFormButtonDuo'
import { space_grotesk } from '@/lib/fonts'
import { LEGAL_LINKS } from '@/components-data/navigation/navLinks'
import { BannerImageUpload } from '@/components/custom-utils/ImageUpload'
import ProfileImageUpload from '@/components/custom-utils/ProfileImageUpload'
import PhoneNumberInput from '@/components/custom-utils/inputs/CustomPhoneInput'


export function IndividualGeneralStep() {
    const { formData, updateFormData, nextStep } = useSignup()

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<IndividualGeneralData>({
        resolver: zodResolver(individualGeneralSchema),
        defaultValues: {
            ...(formData as Partial<IndividualGeneralData>),
            profileImage: (formData as Partial<IndividualGeneralData>).profileImage,
            bannerImage: (formData as Partial<IndividualGeneralData>).bannerImage,
        },
    })

    const selectedCountry = watch('country')

    const countries = Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name }))
    const states = selectedCountry
        ? State.getStatesOfCountry(selectedCountry).map(s => ({ value: s.isoCode, label: s.name }))
        : []

    const onSubmit: SubmitHandler<IndividualGeneralData> = (data) => {
        updateFormData(data)
        nextStep()
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            data-testid="individual-general-form"
        >
            <h2 className={`${space_grotesk.className} text-secondary-9 text-xl md:text-2xl lg:text-3xl font-medium mb-10`}>
                General Information
            </h2>

            <TextInput1
                showLabel
                label="Full Name (as shown on your ID)"
                placeholder="Enter your first and last name"
                required
                {...register('fullName')}
                error={errors.fullName?.message}
                data-testid="full-name"
            />

            <TextInput1
                showLabel
                label="Email address"
                type="email"
                placeholder="Enter your email address"
                required
                {...register('email')}
                error={errors.email?.message}
                data-testid="email"
            />


            <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                    <PhoneNumberInput
                        value={field.value ?? undefined}
                        onChange={(val) => field.onChange(val ?? '')}
                        error={errors.phone?.message}
                        defaultCountry="NG"
                        data-testid="phone"
                    />
                )}
            />

            <Controller
                name="profileImage"
                control={control}
                render={({ field }) => (
                    <ProfileImageUpload
                        value={field.value}
                        onChange={(file) => {
                            field.onChange(file)
                            updateFormData({ profileImage: file ?? undefined })
                        }}
                        error={errors.profileImage?.message}
                    />
                )}
            />

            <Controller
                name="bannerImage"
                control={control}
                render={({ field }) => (
                    <BannerImageUpload
                        value={field.value}
                        onChange={(file) => {
                            field.onChange(file)
                            updateFormData({ bannerImage: file ?? undefined })
                        }}
                        error={errors.bannerImage?.message}
                    />
                )}
            />

            <div className="space-y-5">
                <Controller
                    name="country"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <FormSelect1
                            label="Country"
                            required
                            options={countries}
                            value={field.value}
                            onValueChange={field.onChange}
                            error={errors.country?.message}
                            data-testid="country"
                        />
                    )}
                />

                <Controller
                    name="state"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <FormSelect1
                            label="State"
                            required
                            options={states}
                            value={field.value}
                            onValueChange={field.onChange}
                            error={errors.state?.message}
                            data-testid="state"
                        />
                    )}
                />
            </div>

            <TextInput1
                showLabel
                label="City"
                placeholder="Enter your city"
                required
                {...register('city')}
                error={errors.city?.message}
                data-testid="city"
            />

            <TextInput1
                showLabel
                label="Postal/Zip Code (Optional)"
                placeholder="Enter your postal/zip code"
                {...register('postalCode')}
                error={errors.postalCode?.message}
                data-testid="postal-code"
            />

            <Controller
                name="agreedToTerms"
                control={control}
                render={({ field }) => (
                    <FormCheckbox1
                        id="agreed-to-terms"
                        {...field}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        error={errors.agreedToTerms?.message}
                        className="mt-10"
                        data-testid="agree-terms"
                        label={
                            <span className="font-normal">
                                I agree to the QavTix Seller{' '}
                                <Link href={LEGAL_LINKS.TERMS.href} className="text-accent-6 font-medium hover:underline">
                                    Terms of Service
                                </Link>
                                {' '}and understand the{' '}
                                <Link href={LEGAL_LINKS.TICKET_SERVICE.href} className="text-accent-6 font-medium hover:underline">
                                    Commission structure
                                </Link>.
                            </span>
                        }
                    />
                )}
            />

            <MultiStepFormButtonDuo />
        </form>
    )
}
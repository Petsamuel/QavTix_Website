'use client'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignup } from '@/contexts/HostSignupProvider'
import { organizationGeneralSchema, type OrganizationGeneralData } from '@/schemas/host-signup.schema'
import FormSelect1 from '@/components/custom-utils/inputs/FormSelect1'
import FormCheckbox1 from '@/components/custom-utils/inputs/FormCheckbox1'
import { Country, State } from 'country-state-city';
import Link from 'next/link'
import MultiStepFormButtonDuo from '@/components/custom-utils/buttons/MultiStepFormButtonDuo'
import TextInput1 from '@/components/custom-utils/inputs/TextInput1'
import { BannerImageUpload } from '@/components/custom-utils/ImageUpload'
import ProfileImageUpload from '@/components/custom-utils/ProfileImageUpload'
import PhoneNumberInput from '@/components/custom-utils/inputs/CustomPhoneInput'

export function OrganizationGeneralStep() {
    const { formData, updateFormData, nextStep } = useSignup()

    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm<OrganizationGeneralData>({
        resolver: zodResolver(organizationGeneralSchema),
        defaultValues: {
            ...(formData as Partial<OrganizationGeneralData>),
            profileImage: (formData as Partial<OrganizationGeneralData>).profileImage,
            bannerImage: (formData as Partial<OrganizationGeneralData>).bannerImage,
        },
    })

    const onSubmit: SubmitHandler<OrganizationGeneralData> = (data) => {
        updateFormData(data)
        nextStep()
    }

    const selectedCountry = watch('country')

    const countries = Country.getAllCountries().map(c => ({
        value: c.isoCode,
        label: c.name
    }))

    const states = selectedCountry
        ? State.getStatesOfCountry(selectedCountry).map(s => ({
            value: s.isoCode,
            label: s.name
        }))
        : []


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <TextInput1
                showLabel
                label="Full Name (as shown on your ID)"
                placeholder="Enter contact person's full name"
                required
                {...register('fullName')}
                error={errors.fullName?.message}
            />

            <TextInput1
                showLabel
                label="Company email address"
                type="email"
                placeholder="Enter your company email address"
                required
                {...register('companyEmail')}
                error={errors.companyEmail?.message}
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
                    control={control}
                    render={({ field }) => (
                        <FormSelect1
                            label="Country"
                            required
                            options={countries}
                            value={field.value}
                            onValueChange={field.onChange}
                            error={errors.country?.message}
                        />
                    )}
                />

                <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                        <FormSelect1
                            label="State"
                            required
                            options={states}
                            value={field.value}
                            onValueChange={field.onChange}
                            error={errors.state?.message}
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
                        className='mt-10'
                        label={
                            <span className='font-normal'>
                                I agree to the QavTix Seller{' '}
                                <Link href="/terms" className="text-accent-6 font-medium hover:underline">
                                    Terms of Service
                                </Link>
                                {' '}and understand the{' '}
                                <Link href="/commission" className="text-accent-6 font-medium hover:underline">
                                    commission structure
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
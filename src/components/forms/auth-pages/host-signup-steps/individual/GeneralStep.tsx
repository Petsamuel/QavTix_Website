'use client'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Country, State } from 'country-state-city'
import { useSignup } from '@/contexts/HostSignupProvider'
import { individualGeneralSchema, type IndividualGeneralData } from '@/schemas/host-signup.schema'
import FormInput2 from '@/components/custom-utils/inputs/FormInput2'
import FormSelect1 from '@/components/custom-utils/inputs/FormSelect1'
import FormCheckbox1 from '@/components/custom-utils/inputs/FormCheckbox1'
import MultiStepFormButtonDuo from '@/components/custom-utils/buttons/MultiStepFormButtonDuo'
import { space_grotesk } from '@/lib/fonts'

export function IndividualGeneralStep() {
    const { formData, updateFormData, nextStep } = useSignup()

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<IndividualGeneralData>({
        resolver:      zodResolver(individualGeneralSchema),
        defaultValues: formData as Partial<IndividualGeneralData>,
    })

    const selectedCountry = watch('country')

    const countries = Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name }))
    const states    = selectedCountry
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

            <FormInput2
                label="Full name"
                placeholder="Enter your first and last name"
                required
                {...register('fullName')}
                error={errors.fullName?.message}
                data-testid="full-name"
            />

            <FormInput2
                label="Email address"
                type="email"
                placeholder="Enter your email address"
                required
                {...register('email')}
                error={errors.email?.message}
                data-testid="email"
            />

            <FormInput2
                label="Phone number"
                type="tel"
                placeholder="Enter your phone number"
                required
                {...register('phone')}
                error={errors.phone?.message}
                data-testid="phone"
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

            <FormInput2
                label="City"
                placeholder="Enter your city"
                required
                {...register('city')}
                error={errors.city?.message}
                data-testid="city"
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
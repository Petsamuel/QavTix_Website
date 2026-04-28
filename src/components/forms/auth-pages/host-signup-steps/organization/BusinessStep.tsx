'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Plus } from 'lucide-react'
import { Icon } from '@iconify/react'
import { useSignup } from '@/contexts/HostSignupProvider'
import { organizationBusinessSchema, type OrganizationBusinessData } from '@/schemas/host-signup.schema'
import FormTextarea1 from '@/components/custom-utils/inputs/FormTextarea1'
import FormSelect1 from '@/components/custom-utils/inputs/FormSelect1'
import FormCheckbox1 from '@/components/custom-utils/inputs/FormCheckbox1'
import MultiStepFormButtonDuo from '@/components/custom-utils/buttons/MultiStepFormButtonDuo'
import TextInput1 from '@/components/custom-utils/inputs/TextInput1'

const BUSINESS_TYPES = [
    { value: 'llc', label: 'LLC' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'partnership', label: 'Partnership' },
]

export function OrganizationBusinessStep() {
    const { formData, updateFormData, nextStep, categories } = useSignup()

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OrganizationBusinessData>({
        resolver: zodResolver(organizationBusinessSchema),
        defaultValues: {
            ...(formData as Partial<OrganizationBusinessData>),
            eventCategories: (formData as Partial<OrganizationBusinessData>).eventCategories ?? [],
            relevantLinks: (formData as Partial<OrganizationBusinessData>).relevantLinks ?? [],
        },
    })

    const { fields, append, remove } = useFieldArray<OrganizationBusinessData, "relevantLinks", "id">({
        control,
        name: "relevantLinks",
    })

    const watchedCategories = watch('eventCategories') ?? []

    const toggleCategory = (categoryName: string) => {
        const updated = watchedCategories.includes(categoryName)
            ? watchedCategories.filter(c => c !== categoryName)
            : [...watchedCategories, categoryName]
        setValue('eventCategories', updated, { shouldValidate: true })
    }

    const onSubmit = (data: OrganizationBusinessData) => {
        updateFormData(data)
        nextStep()
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            data-testid="org-business-form"
        >
            <TextInput1
                showLabel
                label="Business/Organization name"
                placeholder="Enter your Business/Organization name"
                required
                {...register('businessName')}
                error={errors.businessName?.message}
                data-testid="business-name"
            />

            <Controller
                name='businessType'
                control={control}
                render={({ field }) => {
                    return (
                        <FormSelect1
                            label="Business type"
                            required
                            options={BUSINESS_TYPES}
                            onValueChange={field.onChange}
                            value={field.value}
                            error={errors.businessType?.message}
                            data-testid="business-type"
                        />
                    )
                }}
            />

            <div className="grid grid-cols-2 gap-4">
                <TextInput1
                    showLabel
                    label="Business registration number"
                    placeholder="Enter registration number"
                    required
                    {...register('registrationNumber')}
                    error={errors.registrationNumber?.message}
                    data-testid="registration-number"
                />
                <TextInput1
                    showLabel
                    label="Tax ID/TIN"
                    placeholder="Enter Tax ID/TIN"
                    required
                    {...register('taxId')}
                    error={errors.taxId?.message}
                    data-testid="tax-id"
                />
            </div>

            <TextInput1
                showLabel
                label="NIN (National Identification Number)"
                placeholder="Enter your 11-digit NIN"
                required
                {...register('nin')}
                error={errors.nin?.message}
                data-testid="nin"
            />

            <TextInput1
                showLabel
                label="Postal code"
                placeholder="Enter your postal code"
                required
                {...register('postalCode')}
                error={errors.postalCode?.message}
                data-testid="postal-code"
            />

            <FormTextarea1
                label="Description"
                placeholder="Let your audience meet you"
                required
                {...register('description')}
                error={errors.description?.message}
                data-testid="description"
            />

            <div>
                <label className="block text-sm font-medium text-neutral-9 mb-2">
                    Relevant links <span className="text-neutral-6">(Optional)</span>
                </label>
                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start">
                            <div className="flex-1">
                                <input
                                    {...register(`relevantLinks.${index}.link`)}
                                    placeholder="https://website.com or social media link"
                                    data-testid={`relevant-link-${index}`}
                                    className={`w-full px-4 py-3 text-sm rounded-[6px] h-14 transition-all outline-none bg-white text-neutral-9 placeholder:text-neutral-6 ${errors.relevantLinks?.[index]
                                            ? 'border border-red-400 focus:border-red-500'
                                            : 'border-[1.5px] border-neutral-5 focus:border-[1.5px] focus:border-primary hover:border-neutral-6'
                                        }`}
                                />
                                {errors.relevantLinks?.[index] && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.relevantLinks[index]?.message}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ link: "" })}
                        className="flex items-center gap-2 text-primary hover:text-primary-7 font-medium text-sm"
                        data-testid="add-link"
                    >
                        <Plus className="w-4 h-4" />
                        Add another link
                    </button>
                </div>
            </div>

            <div className="my-12">
                <label className="block text-sm font-medium text-neutral-9 mb-5">
                    Select event categories you host <span className="text-red-500">*</span>
                </label>

                {categories.length === 0 ? (
                    <div className="flex items-center gap-2 text-neutral-5 text-sm py-4">
                        <Icon icon="eos-icons:three-dots-loading" className="size-6 text-primary" />
                        Loading categories...
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-5">
                        {categories.map((category, index) => (
                            <FormCheckbox1
                                key={category.id}
                                name={`eventCategories-${index}`}
                                id={`eventCategories-${category.id}`}
                                checked={watchedCategories.includes(category.name)}
                                onCheckedChange={() => toggleCategory(category.name)}
                                label={category.name}
                                data-testid={`category-${category.id}`}
                            />
                        ))}
                    </div>
                )}

                {errors.eventCategories && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">
                        {errors.eventCategories.message}
                    </p>
                )}
            </div>

            <MultiStepFormButtonDuo />
        </form>
    )
}
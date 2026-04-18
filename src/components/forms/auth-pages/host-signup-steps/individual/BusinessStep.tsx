'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
import { useSignup } from '@/contexts/HostSignupProvider'
import { individualBusinessSchema, type IndividualBusinessData } from '@/schemas/host-signup.schema'
import TextInput1 from '@/components/custom-utils/inputs/TextInput1'
import FormTextarea1 from '@/components/custom-utils/inputs/FormTextarea1'
import FormCheckbox1 from '@/components/custom-utils/inputs/FormCheckbox1'
import MultiStepFormButtonDuo from '@/components/custom-utils/buttons/MultiStepFormButtonDuo'

export function IndividualBusinessStep() {

    const { formData, updateFormData, nextStep, categories } = useSignup()

    
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<IndividualBusinessData>({
        resolver:   zodResolver(individualBusinessSchema),
        defaultValues: {
            ...(formData as Partial<IndividualBusinessData>),
            eventCategories: (formData as Partial<IndividualBusinessData>).eventCategories ?? [],
            relevantLinks:   (formData as Partial<IndividualBusinessData>).relevantLinks   ?? [],
        },
    })

    const { fields, append, remove } = useFieldArray<IndividualBusinessData, "relevantLinks", "id">({
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

    const onSubmit = (data: IndividualBusinessData) => {
        updateFormData(data)
        nextStep()
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            data-testid="individual-business-form"
        >
            <TextInput1
                showLabel
                label="Brand name"
                placeholder="Enter your brand name"
                required
                {...register('brandName')}
                error={errors.brandName?.message}
                data-testid="brand-name"
            />

            <FormTextarea1
                label="Description"
                placeholder="Let your audience meet you"
                required
                {...register('description')}
                error={errors.description?.message as string}
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
                                    className={`w-full px-4 py-3 text-sm rounded-[6px] h-14 transition-all outline-none bg-white text-neutral-9 placeholder:text-neutral-6 ${
                                        errors.relevantLinks?.[index]?.link
                                            ? 'border border-red-400 focus:border-red-500'
                                            : 'border-[1.5px] border-neutral-5 focus:border-[1.5px] focus:border-primary hover:border-neutral-6'
                                    }`}
                                />
                                {errors.relevantLinks?.[index]?.link && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.relevantLinks[index]?.link?.message}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Icon icon="jam:close" width="24" height="24" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ link: "" })}
                        className="flex items-center gap-2 text-primary hover:text-primary-7 font-medium text-sm"
                        data-testid="add-link"
                    >
                        <Icon icon="stash:plus-duotone" width="24" height="24" />
                        Add more link
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
                        Error Loading Categories...Please refresh page
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
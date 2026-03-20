import {
    IndividualGeneralData,
    IndividualBusinessData,
    OrganizationGeneralData,
    OrganizationBusinessData,
    PasswordData,
} from "@/schemas/host-signup.schema"
import { ApiCategory } from "@/actions/filters"

export type IndividualSubmitData =
    IndividualGeneralData &
    IndividualBusinessData &
    PasswordData

export type OrganizationSubmitData =
    OrganizationGeneralData &
    OrganizationBusinessData &
    PasswordData

function resolveCategoryIds(names: string[], categories: ApiCategory[]): number[] {
    return names
        .map(name => categories.find(c => c.name === name)?.id)
        .filter((id): id is number => id !== undefined)
}

export function buildIndividualPayload(
    formData:   IndividualSubmitData,
    categories: ApiCategory[],
) {
    return {
        email:          formData.email,
        password:       formData.password,
        full_name:      formData.fullName,
        business_name:  formData.brandName,
        phone_number:   formData.phone,
        country:        formData.country,
        state:          formData.state,
        city:           formData.city,
        description:    formData.description,
        categories:     resolveCategoryIds(formData.eventCategories, categories),
        relevant_links: formData.relevantLinks.map(l => ({ url: l.link })),
        agree_to_terms: formData.agreedToTerms,
    }
}

export function buildOrganizationPayload(
    formData:   OrganizationSubmitData,
    categories: ApiCategory[],
) {
    return {
        email:               formData.companyEmail,
        password:            formData.password,
        full_name:           formData.fullName,
        phone_number:        formData.phone,
        companies_email:     formData.companyEmail,
        business_name:       formData.businessName,
        business_type:       formData.businessType,
        registration_number: formData.registrationNumber,
        tax_id:              formData.taxId,
        description:         formData.description,
        country:             formData.country,
        state:               formData.state,
        city:                formData.city,
        postal_code:         formData.postalCode,
        categories:          resolveCategoryIds(formData.eventCategories, categories),
        relevant_links:      formData.relevantLinks.map(l => ({ url: l.link })),
        agree_to_terms:      formData.agreedToTerms,
    }
}
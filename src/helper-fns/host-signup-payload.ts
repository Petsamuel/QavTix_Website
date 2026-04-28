import {
    IndividualGeneralData,
    IndividualBusinessData,
    OrganizationGeneralData,
    OrganizationBusinessData,
    PasswordData,
} from "@/schemas/host-signup.schema"
import { ApiCategory } from "@/actions/filters"

// Define submit data types with images as strings (after upload)
export type IndividualSubmitData = Omit<IndividualGeneralData, 'profileImage' | 'bannerImage'> & {
    profileImage: string;
    bannerImage: string;
} & IndividualBusinessData & PasswordData

export type OrganizationSubmitData = Omit<OrganizationGeneralData, 'profileImage' | 'bannerImage'> & {
    profileImage: string;
    bannerImage: string;
} & OrganizationBusinessData & PasswordData

function resolveCategoryIds(names: string[], categories: ApiCategory[]): number[] {
    return names
        .map(name => categories.find(c => c.name === name)?.id)
        .filter((id): id is number => id !== undefined)
}

export function buildIndividualPayload(
    formData: IndividualSubmitData,
    categories: ApiCategory[],
) {
    return {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        business_name: formData.brandName,
        phone_number: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        description: formData.description,
        postal_code: formData.postalCode,
        nin: formData.nin,
        profile_picture: formData.profileImage,
        profile_banner: formData.bannerImage,
        categories: resolveCategoryIds(formData.eventCategories, categories),
        relevant_links: formData.relevantLinks.map(l => ({ url: l.link })),
        agree_to_terms: formData.agreedToTerms,
    }
}

export function buildOrganizationPayload(
    formData: OrganizationSubmitData,
    categories: ApiCategory[],
) {
    return {
        email: formData.companyEmail,
        password: formData.password,
        full_name: formData.fullName,
        phone_number: formData.phone,
        business_name: formData.businessName,
        business_type: formData.businessType,
        registration_number: formData.registrationNumber,
        tax_id: formData.taxId,
        nin: formData.nin,
        description: formData.description,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        postal_code: formData.postalCode,
        profile_picture: formData.profileImage,
        profile_banner: formData.bannerImage,
        categories: resolveCategoryIds(formData.eventCategories, categories),
        relevant_links: formData.relevantLinks.map(l => ({ url: l.link })),
        agree_to_terms: formData.agreedToTerms,
    }
}
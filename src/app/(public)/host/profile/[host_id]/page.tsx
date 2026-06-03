import { getHostDetails } from "@/actions/host"
import HostPageWrapper from "@/components/host-profile-page/HostPageWrapper"
import { Metadata } from "next"
import { buildPageMetadata } from "@/metadata"
import HostNotFound from "@/components/host-profile-page/HostNotFound"

interface Props {
    params: Promise<{ host_id: string }>
}

export async function generateMetadata(
    { params }: { params: Promise<{ host_id: string }> }
): Promise<Metadata> {
    const { host_id } = await params

    return buildPageMetadata(
        `Host Profile`,
        undefined,
        `/host/profile/${host_id}`,
    )
}

export default async function HostProfilePage({ params }: Props) {
    const { host_id } = await params

    const result = await getHostDetails(host_id)

    if (!result.success || !result.data) {
        return <HostNotFound />
    }

    return <HostPageWrapper host={result.data} />
}
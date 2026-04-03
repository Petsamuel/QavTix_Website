import { notFound } from "next/navigation"
import { getHostDetails } from "@/actions/host"
import HostPageWrapper from "@/components/host-profile-page/HostPageWrapper"

interface Props {
    params: Promise<{ host_id: string }>
}

export default async function HostProfilePage({ params }: Props) {
    const { host_id } = await params

    const result = await getHostDetails(host_id)

    if (!result.success || !result.data) notFound()

    return <HostPageWrapper host={result.data} />
}
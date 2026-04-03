import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor } from "@/helper-fns/getAvatarColor";
import { getInitialsFromName } from "@/helper-fns/getInitialFromName";
import { cn } from "@/lib/utils";


function CustomAvatar({ profileImg, name, id, size, textSize = "text-xl" }: { textSize?: string, profileImg?: string | null; name: string; id: string, size: string }) {
    return (
        <Avatar className={cn(size, "ring-3 ring-neutral-2")}>
            {profileImg ? (
                <AvatarImage src={profileImg} />
            ) : null}
            <AvatarFallback className={`${getAvatarColor(id)} ${textSize} text-white font-semibold`}>
                {getInitialsFromName(name)}
            </AvatarFallback>
        </Avatar>
    )
}

export default CustomAvatar;
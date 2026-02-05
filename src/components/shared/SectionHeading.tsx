import { space_grotesk } from "@/lib/fonts";

type SectionHeadingProps = {
  title: string;
  headerClassName?: string;
  className?: string;
}

function SectionHeading({
  title,
  headerClassName = "",
  className = "",
}: SectionHeadingProps) {
      return (
        <div
            className={`w-[70%] h-52 lg:h-75 bg-secondary-6 flex justify-end items-end rounded-br-[45px] md:rounded-br-[105px] lg:rounded-br-[130px] pt-40 lg:pt-52 pb-5 md:pb-8 px-10 md:px-20 lg:px-28 ${className}`}
        >
            <h1
              className={`${headerClassName} ${space_grotesk.className} text-white font-medium text-right text-3xl md:text-5xl lg:text-7xl`}
            >
                {title}
            </h1>
        </div>
    )
}

export default SectionHeading;

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
      className={`w-[70%] h-28 md:h-34 lg:h-48 bg-secondary-6 flex justify-end items-end rounded-br-[45px] md:rounded-br-[105px] lg:rounded-br-[130px] pt-10 pb-3 md:pb-5 px-10 md:px-20 lg:px-28 ${className}`}
    >
      <h1
        className={`${headerClassName} ${space_grotesk.className} text-white font-medium text-right text-xl md:text-[40px] lg:text-6xl`}
      >
        {title}
      </h1>
    </div>
  )
}

export default SectionHeading;

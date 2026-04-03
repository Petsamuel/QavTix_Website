
type ErrorParaProps = React.HTMLAttributes<HTMLParagraphElement> & {
    error: string
}

export default function ErrorPara({ error, className, ...rest }: ErrorParaProps) {
    return (
        <p
            className={`text-xs text-red-500 mt-1.5 ml-1 ${className ?? ""}`.trim()}
            {...rest}
        >
            {error}
        </p>
    )
}
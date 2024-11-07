type ButtonProps = {
    label: string,
    handleClick: () => void,
    variant?: 'standard' | 'start' | 'control',
    ariaLabel?: string
}

const Button = ({label, handleClick, variant, ariaLabel}: ButtonProps) => {
    return (
        <button
            className={variant != null ? `btn-${variant}` : undefined}
            onClick={handleClick}
            {...(ariaLabel != null ? { "aria-label": ariaLabel }: {})}
        >
            {label}
        </button>
    )
}

export default Button;

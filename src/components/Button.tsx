type ButtonProps = {
    label: string,
    handleClick: () => void,
    variant?: 'standard' | 'start' | 'control'
}

const Button = ({label, handleClick, variant}: ButtonProps) => {
    return (
        <button
            className={variant != null ? `btn-${variant}` : undefined}
            onClick={handleClick}
        >
            {label}
        </button>
    )
}

export default Button;

const Button = ({ children, onClick, type, className = 'bg-coffee-600', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`cursor-pointer transition duration-300 px-4 py-2 text-coffee-50 rounded hover:bg-coffee-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;
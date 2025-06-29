const Button = ({ children, onClick, type, className = 'bg-coffee-600', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`cursor-pointer transition duration-300 px-4 py-2 text-coffee-50 rounded hover:bg-coffee-700 focus:outline-none focus:ring-2 focus:ring-coffee-500 disabled:cursor-disabled disabled:opacity-50 ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;
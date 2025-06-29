const IconButton = ({
  children,
  isActive,
  isDisabled,
  onClick,
  title,
  activeClass = "bg-coffee-500 text-coffee-50",
  inactiveClass = "bg-coffee-50 text-coffee-500",
  disabledClass = "cursor-not-allowed opacity-50",
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition ${
        isActive ? activeClass : inactiveClass
      } ${isDisabled ? disabledClass : "cursor-pointer hover:bg-coffee-200"}`}
      title={title}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default IconButton;
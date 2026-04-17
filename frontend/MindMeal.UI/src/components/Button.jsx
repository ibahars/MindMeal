const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) => {
  const variants = {
    primary: "bg-[#CD7102] hover:bg-[#B84712] text-white",
    secondary: "bg-[#B84712] hover:bg-orange-700 text-white",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-2 rounded-[45px] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

import React from 'react';

const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "font-bold py-3 px-6 rounded-2xl shadow-[0_4px_0_rgb(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 select-none";
  
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
    secondary: "bg-blue-500 hover:bg-blue-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    neutral: "bg-gray-200 hover:bg-gray-300 text-gray-700",
    locked: "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
  };

  return (
    <button 
      onClick={disabled ? null : onClick} 
      disabled={disabled}
      className={`${baseStyle} ${disabled ? variants.locked : variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
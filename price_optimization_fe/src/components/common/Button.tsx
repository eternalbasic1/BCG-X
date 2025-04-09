import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

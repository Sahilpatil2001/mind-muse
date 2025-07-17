import type { FC, ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`py-3 bg-purple-700 text-white font-semibold rounded-[10px] cursor-pointer hover:bg-purple-800 transition duration-200 shadow-md shadow-purple-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;

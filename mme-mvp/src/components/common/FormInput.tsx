import type { FC, ChangeEvent } from "react";

interface FormInputProps {
  type: "text" | "number" | "email" | "password" | "date";
  placeholder?: string;
  name?: string;
  value: string | number;
  className?: string;
  step?: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: FC<FormInputProps> = ({
  type,
  placeholder,
  name,
  value,
  step,
  onChange,
  className = "",
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      step={step}
      className={`border border-[#fff9] py-4 px-4 rounded-[10px] outline-none indent-1 ${className}`}
    />
  );
};

export default FormInput;

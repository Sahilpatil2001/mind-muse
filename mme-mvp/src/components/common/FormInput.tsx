import type { FC, ChangeEvent } from "react";

interface FormInputProps {
    type: string;
    placeholder?: string;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: FC<FormInputProps> = (
    {
       type,
       placeholder,
       name,
       value,
       onChange,
    }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            className="w-[40%] border border-[#fff9] py-4 px-4 rounded-[10px] outline-none indent-1"
        />
    );
};

export default FormInput;

import React from "react";

const FormInput = ({ type, placeholder, name, value, onChange }) => {
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

import React from "react";

export default function FloatingInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = " ",
  ...props
}) {
  return (
    <div className="relative w-full">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="peer w-full border rounded px-3 pt-7 pb-2 
                   focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        {...props}
      />
      <label
        htmlFor={name}
        className="absolute left-3 top-3 text-gray-500 text-sm transition-all
                   peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:text-base
                   peer-focus:top-3 peer-focus:text-sm peer-focus:text-blue-500"
      >
        {label}
      </label>
    </div>
  );
}

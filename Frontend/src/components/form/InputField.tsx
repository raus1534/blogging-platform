import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  placeholder: string;
}

export default function InputField({
  label,
  name,
  placeholder,
  ...rest
}: Props) {
  return (
    <div className="flex flex-col-reverse">
      <input
        id={name}
        name={name}
        type="text"
        className="w-full p-1 bg-transparent border-2 rounded outline-none dark:border-dark-subtle peer"
        placeholder={placeholder}
        {...rest}
      />
      <label
        htmlFor={name}
        className="self-start font-semibold dark:text-dark-subtle"
      >
        {label}
      </label>
    </div>
  );
}

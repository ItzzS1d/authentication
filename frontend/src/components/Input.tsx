import { forwardRef } from "react";
import { type ComponentPropsWithoutRef } from "react";

type InputProps = {
  label: string;
  inputType: "text" | "number" | "password";
} & ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, inputType, ...props }, ref) => {
    return (
      <div className="w-full">
        <label htmlFor={label} className="flex flex-col">
          <span>{label}</span>
          <input
            id={label}
            type={inputType}
            className="border rounded-md py-1.5 w-full pl-2"
            ref={ref}
            {...props}
          />
        </label>
      </div>
    );
  }
);

export default Input;

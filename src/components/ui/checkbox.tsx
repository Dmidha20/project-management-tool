import type { ChangeEventHandler, InputHTMLAttributes } from "react";

export type ICheckBox = {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  id?: string;
  className?: string;
  name?: string;
};

export function CheckBox({
  checked,
  disabled,
  indeterminate,
  onChange,
  id,
  className = "",
  name,
  ...rest
}: ICheckBox & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      id={id}
      name={name}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      ref={(element) => {
        if (element) {
          element.indeterminate = !!indeterminate;
        }
      }}
      className={`h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary-300)] ${className}`}
      {...rest}
    />
  );
}

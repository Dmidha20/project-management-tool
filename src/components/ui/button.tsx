import clsx from "clsx";
import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outlined" | "link" | "clear";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
};

const base =
  "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ease-in-out cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]";

const variants = {
  primary: {
    class:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300",
    withBase: true,
  },

  outlined: {
    class:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus:ring-2 focus:ring-slate-300",
    withBase: true,
  },

  link: {
    class:
      "bg-transparent p-0 text-indigo-600 font-medium hover:text-indigo-700 underline shadow-none",
    withBase: false,
  },

  clear: {
    class:
      "bg-transparent p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg shadow-none",
    withBase: false,
  },
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      className = "",
      icon,
      iconPosition = "left",
      loading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { class: variantClass, withBase } = variants[variant];

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        className={clsx(withBase ? clsx(base, variantClass) : variantClass, className)}
        {...props}
      >
        {loading ? (
          <span
            className={clsx(
              "mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-t-transparent",
              variant === "outlined" ? "border-slate-700" : "border-white",
            )}
          />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="mr-2 flex items-center">{icon}</span>
            )}

            {children}

            {icon && iconPosition === "right" && (
              <span className="ml-2 flex items-center">{icon}</span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
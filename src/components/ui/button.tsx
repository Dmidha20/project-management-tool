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
      "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-700)] focus:ring-2 focus:ring-[var(--color-primary-300)]",
    withBase: true,
  },

  outlined: {
    class:
      "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] focus:ring-2 focus:ring-[var(--color-neutral-300)]",
    withBase: true,
  },

  link: {
    class:
      "bg-transparent p-0 text-[var(--color-primary)] font-medium hover:text-[var(--color-primary-700)] underline shadow-none",
    withBase: false,
  },

  clear: {
    class:
      "bg-transparent p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] rounded-lg shadow-none",
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
              variant === "outlined" ? "border-[var(--color-text-primary)]" : "border-[var(--color-on-primary)]",
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

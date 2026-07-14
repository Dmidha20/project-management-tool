import { cn } from "@app/lib";

export const inputClass =
  "h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-primary-300)]";

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export const Field = ({ label, required, hint, className, children }: FieldProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <label className="text-sm font-medium text-[var(--color-text-primary)]">
      {label}
      {required && <span className="ml-0.5 text-[var(--color-error-600)]">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-[var(--color-text-secondary)]">{hint}</p>}
  </div>
);

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput = ({ className, ...props }: TextInputProps) => (
  <input className={cn(inputClass, className)} {...props} />
);

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({ className, rows = 3, ...props }: TextareaProps) => (
  <textarea
    rows={rows}
    className={cn(
      "w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-primary-300)]",
      className,
    )}
    {...props}
  />
);

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-text-inverse hover:bg-brand-secondary active:bg-brand-primary/90 disabled:bg-brand-secondary/55",
  secondary:
    "bg-brand-accent text-text hover:bg-brand-accentLight active:bg-brand-accent/90 disabled:bg-brand-accent/40",
  outline:
    "border border-border-strong bg-surface text-text hover:bg-surface-secondary active:bg-surface-secondary/90 disabled:border-border disabled:text-text-disabled",
  ghost:
    "bg-transparent text-brand-secondary hover:bg-surface-secondary active:bg-surface-secondary/90 disabled:text-text-disabled",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-body-sm",
  md: "h-11 px-4 text-body font-semibold",
  lg: "h-12 px-5 text-body-lg font-semibold",
  icon: "h-11 w-11 p-0",
};

export function Button({
  variant = "primary",
  size = "md",
  startIcon,
  endIcon,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors duration-fast ease-standard",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        "disabled:cursor-not-allowed disabled:opacity-100",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {startIcon ? <span aria-hidden>{startIcon}</span> : null}
      {children ? <span>{children}</span> : null}
      {endIcon ? <span aria-hidden>{endIcon}</span> : null}
    </button>
  );
}
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface PulsrButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-p-primary text-p-on-primary hover:opacity-90 shadow-xl shadow-p-primary/10",
  secondary:
    "bg-p-surface-container-high text-p-on-surface hover:bg-p-surface-bright",
  ghost: "text-p-on-surface-variant hover:text-p-on-surface",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function PulsrButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: PulsrButtonProps) {
  return (
    <button
      className={cn(
        "rounded-xl font-semibold active:scale-95 transition-all duration-150 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

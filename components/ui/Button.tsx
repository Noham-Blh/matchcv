import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
}

const variants = {
  primary: "bg-ink text-white hover:bg-cobalt-700 active:bg-cobalt-800",
  secondary: "bg-white text-ink border border-line hover:border-ink",
  ghost: "bg-transparent text-ink hover:bg-paper-dim",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
    const classes = clsx(
      "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
      variants[variant],
      sizes[size],
      className
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

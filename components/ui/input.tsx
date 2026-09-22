import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-void px-3 py-2 text-sm text-heading placeholder:text-muted transition-all duration-150 focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary-bg disabled:cursor-not-allowed disabled:bg-base disabled:text-muted",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

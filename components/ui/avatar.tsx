import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string; initials?: string }
>(({ className, src, alt, initials, ...props }, ref) => {
  if (src) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={alt ?? "Avatar"}
          className="aspect-square h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-extrabold",
        className
      )}
      {...props}
    >
      {initials?.slice(0, 2).toUpperCase()}
    </div>
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => {
  return (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-base text-subtle text-xs font-semibold",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };

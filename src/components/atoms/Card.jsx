import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  padding = "md",
  hover = false,
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface border border-gray-200 shadow-sm",
    elevated: "bg-surface shadow-md border border-gray-100",
    glass: "bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md"
  };
  
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg transition-all duration-200 ease-out",
        variants[variant],
        paddings[padding],
        hover && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
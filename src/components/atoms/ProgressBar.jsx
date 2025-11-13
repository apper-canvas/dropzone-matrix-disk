import React from "react";
import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  value = 0, 
  className,
  showPercentage = true,
  size = "md",
  variant = "primary",
  animated = true,
  ...props 
}) => {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };
  
  const variants = {
    primary: "from-primary to-blue-500",
    success: "from-success to-emerald-500",
    warning: "from-warning to-orange-500",
    error: "from-error to-red-500"
  };
  
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex items-center justify-between mb-1">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(value)}%
          </span>
        )}
      </div>
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full bg-gradient-to-r transition-all duration-300 ease-out rounded-full",
            variants[variant],
            animated && "progress-fill"
          )}
          style={{ 
            width: `${Math.min(100, Math.max(0, value))}%`,
            '--progress-width': `${Math.min(100, Math.max(0, value))}%`
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
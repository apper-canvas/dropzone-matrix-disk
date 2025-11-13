import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  className,
  title = "No data found",
  description = "There's nothing to show here yet.",
  icon = "FileText",
  action,
  actionLabel = "Get Started",
  onAction,
  ...props 
}) => {
  return (
    <div className={cn("text-center py-12 px-4", className)} {...props}>
      {/* Empty State Icon */}
      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
        <ApperIcon 
          name={icon} 
          size={32} 
          className="text-gray-400" 
        />
      </div>
      
      {/* Empty State Text */}
      <div className="space-y-3 max-w-sm mx-auto mb-8">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{description}</p>
      </div>
      
      {/* Action Button */}
      {(action || onAction) && (
        <div>
          <Button
            variant="primary"
            icon="Plus"
            onClick={onAction}
            className="mx-auto"
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Empty;
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const ErrorView = ({ 
  className,
  title = "Something went wrong",
  message = "We encountered an error while processing your request. Please try again.",
  onRetry,
  showRetry = true,
  ...props 
}) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-gray-100 p-4", className)} {...props}>
      <Card variant="elevated" className="max-w-md w-full text-center" padding="xl">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-error/20 to-error/10 flex items-center justify-center mb-6">
          <ApperIcon 
            name="AlertCircle" 
            size={32} 
            className="text-error" 
          />
        </div>
        
        {/* Error Text */}
        <div className="space-y-3 mb-8">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && onRetry && (
            <Button
              variant="primary"
              icon="RefreshCw"
              onClick={onRetry}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            icon="Home"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto"
          >
            Reload Page
          </Button>
        </div>
        
        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If this problem persists, please check your internet connection or try refreshing the page.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ErrorView;
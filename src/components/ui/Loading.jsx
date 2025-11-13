import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ className, message = "Loading...", ...props }) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-gray-100", className)} {...props}>
      <div className="text-center space-y-6 p-8">
        {/* Animated Upload Icon */}
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full animate-pulse"></div>
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <ApperIcon 
              name="Upload" 
              size={32} 
              className="text-white animate-bounce" 
            />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <div className="text-lg font-semibold text-gray-900">{message}</div>
          <div className="text-sm text-gray-500">Please wait while we prepare your file uploader</div>
        </div>
        
        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
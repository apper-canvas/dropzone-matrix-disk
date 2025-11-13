import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ 
  onClearAll,
  hasFiles = false,
  className,
  ...props 
}) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-8 py-6", className)} {...props}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <ApperIcon name="Upload" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                DropZone
              </h1>
              <p className="text-sm text-gray-500">File Upload Manager</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {hasFiles && (
              <Button
                variant="outline"
                size="sm"
                icon="Trash2"
                onClick={onClearAll}
              >
                Clear All
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              icon="Settings"
              className="w-10 h-10 p-0"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProgressBar from "@/components/atoms/ProgressBar";
import Card from "@/components/atoms/Card";
import { formatFileSize, getFileIcon } from "@/utils/fileUtils";

const FileCard = ({ 
  file,
  onRemove,
  className,
  ...props 
}) => {
  const isUploading = file.status === "uploading";
  const isCompleted = file.status === "completed";
  const isError = file.status === "error";
  
  const getStatusColor = () => {
    if (isError) return "text-error";
    if (isCompleted) return "text-success";
    if (isUploading) return "text-primary";
    return "text-gray-500";
  };
  
  const getStatusIcon = () => {
    if (isError) return "AlertCircle";
    if (isCompleted) return "CheckCircle2";
    if (isUploading) return "Loader2";
    return "Clock";
  };
  
  return (
    <Card
      className={cn(
        "file-card transition-all duration-200 ease-out",
        isCompleted && "border-success/20 bg-gradient-to-r from-success/5 to-emerald-50/50",
        isError && "border-error/20 bg-gradient-to-r from-error/5 to-red-50/50",
        className
      )}
      padding="md"
      {...props}
    >
      <div className="flex items-center space-x-4">
        {/* File Preview/Icon */}
        <div className="flex-shrink-0">
          {file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <ApperIcon 
                name={getFileIcon(file.type)} 
                size={24} 
                className="text-gray-600" 
              />
            </div>
          )}
        </div>
        
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </h3>
            <div className="flex items-center space-x-2 ml-4">
              <ApperIcon 
                name={getStatusIcon()} 
                size={16} 
                className={cn(
                  getStatusColor(),
                  isUploading && "animate-spin"
                )} 
              />
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(file.id)}
                  icon="X"
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-error"
                />
              )}
            </div>
          </div>
          
          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span className="capitalize">{file.type.split("/")[1] || "Unknown"}</span>
            {file.uploadedAt && (
              <>
                <span>•</span>
                <span>{new Date(file.uploadedAt).toLocaleTimeString()}</span>
              </>
            )}
          </div>
          
          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-3">
              <ProgressBar 
                value={file.progress} 
                size="sm" 
                variant="primary"
                animated={true}
              />
            </div>
          )}
          
          {/* Error Message */}
          {isError && file.error && (
            <div className="mt-2 text-xs text-error bg-error/10 rounded px-2 py-1">
              {file.error}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FileCard;
import React, { useRef, useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { isFileTypeAllowed } from "@/utils/fileUtils";

const DropZone = ({ 
  onFilesSelected,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = [],
  maxFiles = 10,
  className,
  ...props 
}) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter - 1 === 0) {
      setIsDragOver(false);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  
  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };
  
  const handleFiles = (files) => {
    const validFiles = [];
    const errors = [];
    
    files.forEach(file => {
      // Check file count
      if (validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }
      
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large (max ${Math.round(maxFileSize / 1024 / 1024)}MB)`);
        return;
      }
      
      // Check file type
      if (allowedTypes.length > 0 && !isFileTypeAllowed(file, allowedTypes)) {
        errors.push(`${file.name} is not an allowed file type`);
        return;
      }
      
      validFiles.push(file);
    });
    
    onFilesSelected(validFiles, errors);
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div
      className={cn(
        "drop-zone relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-200 ease-out cursor-pointer",
        "hover:border-primary hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/2",
        "focus:outline-none focus:ring-4 focus:ring-primary/20",
        isDragOver && "drag-over border-primary bg-gradient-to-br from-primary/10 to-primary/5 scale-[1.02]",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
      tabIndex={0}
      {...props}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInput}
        className="hidden"
        accept={allowedTypes.join(",")}
      />
      
      <div className="space-y-6">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <ApperIcon 
            name={isDragOver ? "Download" : "Upload"} 
            size={32} 
            className={cn(
              "transition-all duration-200",
              isDragOver ? "text-primary animate-bounce" : "text-primary/70"
            )} 
          />
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {isDragOver ? "Drop files here" : "Upload your files"}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Drag and drop files here, or click to browse and select files from your device
          </p>
        </div>
        
        {/* Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            icon="FolderOpen"
            onClick={handleBrowseClick}
          >
            Browse Files
          </Button>
        </div>
        
        {/* File Restrictions */}
        <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
          <p>Maximum file size: {Math.round(maxFileSize / 1024 / 1024)}MB</p>
          <p>Maximum files: {maxFiles}</p>
          {allowedTypes.length > 0 && (
            <p>Allowed types: {allowedTypes.join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropZone;
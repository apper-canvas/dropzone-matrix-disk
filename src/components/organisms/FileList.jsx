import React from "react";
import { cn } from "@/utils/cn";
import FileCard from "@/components/molecules/FileCard";
import Empty from "@/components/ui/Empty";

const FileList = ({ 
  files,
  onRemoveFile,
  className,
  ...props 
}) => {
  if (files.length === 0) {
    return (
      <div className={cn("py-8", className)}>
        <Empty
          title="No files uploaded yet"
          description="Start by dragging and dropping files or click the browse button above"
          icon="Upload"
        />
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Uploaded Files ({files.length})
        </h2>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Uploading</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-error"></div>
            <span>Failed</span>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
        {files.map((file) => (
<FileCard
            key={file.id || file.Id}
            file={file}
            onRemove={onRemoveFile}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;
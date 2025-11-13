import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { formatFileSize } from "@/utils/fileUtils";

const UploadStats = ({ 
  files,
  className,
  ...props 
}) => {
  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === "completed").length;
  const uploadingFiles = files.filter(f => f.status === "uploading").length;
  const errorFiles = files.filter(f => f.status === "error").length;
  
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const completedSize = files
    .filter(f => f.status === "completed")
    .reduce((acc, file) => acc + file.size, 0);
  
  const stats = [
    {
      label: "Total Files",
      value: totalFiles,
      icon: "Files",
      color: "text-gray-600"
    },
    {
      label: "Completed",
      value: completedFiles,
      icon: "CheckCircle2",
      color: "text-success"
    },
    {
      label: "Uploading",
      value: uploadingFiles,
      icon: "Upload",
      color: "text-primary"
    },
    {
      label: "Failed",
      value: errorFiles,
      icon: "AlertCircle",
      color: "text-error"
    }
  ];
  
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-4", className)} {...props}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ApperIcon 
                name={stat.icon} 
                size={20} 
                className={stat.color} 
              />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {totalSize > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Size:</span>
            <span className="font-medium text-gray-900">{formatFileSize(totalSize)}</span>
          </div>
          {completedSize > 0 && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">Uploaded:</span>
              <span className="font-medium text-success">{formatFileSize(completedSize)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadStats;
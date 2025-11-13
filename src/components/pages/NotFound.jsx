import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-100 flex items-center justify-center p-4">
      <Card variant="elevated" className="max-w-md w-full text-center" padding="xl">
        {/* 404 Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-8">
          <ApperIcon 
            name="FileQuestion" 
            size={40} 
            className="text-primary" 
          />
        </div>
        
        {/* 404 Text */}
        <div className="space-y-4 mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to uploading files!
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            icon="Home"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            icon="Upload"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            Start Uploading
          </Button>
        </div>
        
        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If you think this is an error, please refresh the page or contact support.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
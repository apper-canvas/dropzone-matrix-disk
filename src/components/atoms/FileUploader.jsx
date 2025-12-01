import { useEffect, useRef, useState, useMemo } from 'react';

const ApperFileFieldComponent = ({ config, elementId }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  // Use refs for tracking lifecycle and preventing memory leaks
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when it changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoize existingFiles to prevent re-renders and detect actual changes
  const memoizedExistingFiles = useMemo(() => {
    if (!config.existingFiles || !Array.isArray(config.existingFiles)) {
      return [];
    }
    
    // Return empty array if no files or detect changes by length and first file's ID
    if (config.existingFiles.length === 0) {
      return [];
    }
    
    // Simple change detection - compare with previous reference
    if (existingFilesRef.current.length !== config.existingFiles.length) {
      return config.existingFiles;
    }
    
    // Check if first file ID changed (indicates different files)
    const currentFirstId = config.existingFiles[0]?.Id || config.existingFiles[0]?.id;
    const prevFirstId = existingFilesRef.current[0]?.Id || existingFilesRef.current[0]?.id;
    
    if (currentFirstId !== prevFirstId) {
      return config.existingFiles;
    }
    
    return existingFilesRef.current;
  }, [config.existingFiles]);

  // Initial Mount Effect
  useEffect(() => {
    const initializeApperSDK = async () => {
      try {
        // Initialize ApperSDK with retry mechanism
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!window.ApperSDK && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded. Please ensure the SDK script is included before this component.');
        }

        const { ApperFileUploader } = window.ApperSDK;
        elementIdRef.current = `file-uploader-${elementId}`;
        
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });
        
        mountedRef.current = true;
        existingFilesRef.current = memoizedExistingFiles;
        setIsReady(true);
        setError(null);
        
      } catch (error) {
        console.error('Failed to initialize ApperFileUploader:', error);
        setError(error.message);
        setIsReady(false);
      }
    };

    initializeApperSDK();

    // Cleanup on component destruction
    return () => {
      try {
        if (mountedRef.current && window.ApperSDK?.ApperFileUploader) {
          window.ApperSDK.ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
        mountedRef.current = false;
        setIsReady(false);
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    };
  }, [elementId, config.fieldKey, config.fieldName, config.tableName]);

  // File Update Effect
  useEffect(() => {
    const updateFiles = async () => {
      // Early returns for safety checks
      if (!isReady || !window.ApperSDK?.ApperFileUploader || !config.fieldKey) {
        return;
      }

      try {
        // Deep equality check with JSON.stringify
        const currentFilesStr = JSON.stringify(memoizedExistingFiles);
        const prevFilesStr = JSON.stringify(existingFilesRef.current);
        
        if (currentFilesStr === prevFilesStr) {
          return; // No changes detected
        }

        // Format detection and conversion if needed
        let filesToUpdate = memoizedExistingFiles;
        
        if (memoizedExistingFiles.length > 0) {
          // Check if files are in API format (Id) vs UI format (id)
          const hasApiFormat = memoizedExistingFiles[0].hasOwnProperty('Id');
          
          if (hasApiFormat) {
            // Convert from API format to UI format
            filesToUpdate = window.ApperSDK.ApperFileUploader.toUIFormat(memoizedExistingFiles);
          }
          
          // Update files
          await window.ApperSDK.ApperFileUploader.FileField.updateFiles(
            config.fieldKey, 
            filesToUpdate
          );
        } else {
          // Clear field if empty
          await window.ApperSDK.ApperFileUploader.FileField.clearField(config.fieldKey);
        }
        
        // Update reference for next comparison
        existingFilesRef.current = memoizedExistingFiles;
        
      } catch (error) {
        console.error('Error updating files:', error);
        setError(error.message);
      }
    };

    updateFiles();
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  // Error Handling - show error UI if error state exists
  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50">
        <div className="text-red-600 text-sm">
          <strong>File Upload Error:</strong> {error}
        </div>
      </div>
    );
  }

  // Main container - always render with unique ID
  return (
    <div className="apper-file-uploader">
      {/* Loading UI - show when not ready */}
      {!isReady && (
        <div className="flex items-center justify-center p-8 border border-gray-200 rounded-md bg-gray-50">
          <div className="text-gray-600 text-sm">Loading file uploader...</div>
        </div>
      )}
      
      {/* File uploader container - SDK takes over when mounted */}
      <div id={`file-uploader-${elementId}`} />
    </div>
  );
};

export default ApperFileFieldComponent;
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import DropZone from "@/components/organisms/DropZone";
import FileList from "@/components/organisms/FileList";
import UploadStats from "@/components/molecules/UploadStats";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import uploadService from "@/services/api/uploadService";
import { generateFileId } from "@/utils/fileUtils";
import ApperFileFieldComponent from "@/components/atoms/FileUploader";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [filesData, configData] = await Promise.all([
        uploadService.getAll(),
        uploadService.getConfig()
      ]);
      
      setFiles(filesData);
      setConfig(configData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

const handleFilesSelected = async (selectedFiles, errors) => {
    // Show validation errors
    errors.forEach(error => {
      toast.error(error);
    });

    if (selectedFiles.length === 0) return;

    // Add files to state immediately
    const newFiles = selectedFiles.map(file => ({
      id: generateFileId(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "preparing",
      progress: 0,
      uploadedAt: null,
      preview: null,
      file: file
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Start uploading files
    for (const fileData of newFiles) {
      try {
        const uploadedFile = await uploadService.uploadFile(fileData.file, (updatedFile) => {
          setFiles(prev => prev.map(f => 
            f.id === fileData.id ? { ...f, ...updatedFile, id: fileData.id } : f
          ));
        });
        
        toast.success(`${fileData.name} uploaded successfully!`);
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileData.id 
            ? { ...f, status: "error", error: error.message }
            : f
        ));
        toast.error(`Failed to upload ${fileData.name}`);
      }
    }
  };

const handleRemoveFile = async (fileId) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    // If file is uploading, confirm removal
    if (file.status === "uploading") {
      const confirmed = window.confirm("This file is still uploading. Are you sure you want to cancel?");
      if (!confirmed) return;
    }

    try {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      
      // If file was completed and has database ID, remove from service
      if (file.id && typeof file.id === 'number') {
        await uploadService.remove(file.id);
      }
      
      toast.success("File removed successfully");
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file");
    }
  };

  const handleClearAll = async () => {
    const confirmed = window.confirm("Are you sure you want to clear all files?");
    if (!confirmed) return;

    try {
      await uploadService.clearAll();
      setFiles([]);
      toast.success("All files cleared");
    } catch (error) {
      console.error("Error clearing files:", error);
      toast.error("Failed to clear files");
    }
  };

  if (loading) {
    return <Loading message="Initializing DropZone..." />;
  }

  if (error) {
    return (
      <ErrorView
        title="Failed to Initialize"
        message="We couldn't load the file uploader. Please check your connection and try again."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-100">
      <Header 
        onClearAll={handleClearAll}
        hasFiles={files.length > 0}
      />
      
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="space-y-8">
          {/* Upload Stats */}
          {files.length > 0 && (
            <UploadStats files={files} />
          )}
          
          {/* Drop Zone */}
<div className="max-w-2xl mx-auto">
            <DropZone
              onFilesSelected={handleFilesSelected}
              maxFileSize={config?.maxFileSize}
              allowedTypes={config?.allowedTypes}
              maxFiles={config?.maxFiles}
            />
          </div>

          {/* ApperFileFieldComponent for Files type upload */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Files with Database Integration</h3>
              <ApperFileFieldComponent
                elementId="file-upload-preview"
                config={{
                  fieldKey: 'preview_c',
                  fieldName: 'preview_c',
                  tableName: 'uploaded_file_c',
                  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
                  existingFiles: uploadedFiles,
                  fileCount: uploadedFiles.length
                }}
              />
            </div>
          </div>

          {/* File List */}
          <div className="max-w-4xl mx-auto">
            <FileList
              files={files}
              onRemoveFile={handleRemoveFile}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
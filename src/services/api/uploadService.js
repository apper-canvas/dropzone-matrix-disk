import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

class UploadService {
  constructor() {
    this.tableName = 'uploaded_file_c';
    this.configTableName = 'upload_config_c';
  }

  // Get upload configuration from database
  async getConfig() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "max_file_size_c"}},
          {"field": {"Name": "max_files_c"}},
          {"field": {"Name": "allowed_types_c"}}
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.configTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        // Return default config if no database config found
        return {
          maxFileSize: 10485760,
          allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
          maxFiles: 10
        };
      }

      if (response.data && response.data.length > 0) {
        const config = response.data[0];
        return {
          maxFileSize: config.max_file_size_c || 10485760,
          maxFiles: config.max_files_c || 10,
          allowedTypes: config.allowed_types_c ? 
            config.allowed_types_c.split('\n').filter(type => type.trim()) : 
            ["image/jpeg", "image/png", "application/pdf"]
        };
      }

      // Return default if no config found
      return {
        maxFileSize: 10485760,
        allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
        maxFiles: 10
      };
    } catch (error) {
      console.error("Error fetching upload config:", error);
      return {
        maxFileSize: 10485760,
        allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
        maxFiles: 10
      };
    }
  }

  // Get all uploaded files from database
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "error_c"}},
          {"field": {"Name": "preview_c"}},
          {"field": {"Name": "file_content_c"}}
        ],
        orderBy: [{"fieldName": "uploaded_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      return (response.data || []).map(file => ({
        id: file.Id,
        name: file.Name,
        size: file.size_c,
        type: file.type_c,
        status: file.status_c,
        progress: file.progress_c,
        uploadedAt: file.uploaded_at_c,
        error: file.error_c,
        preview: file.preview_c,
        fileContent: file.file_content_c
      }));
    } catch (error) {
      console.error("Error fetching files:", error);
      return [];
    }
  }

  // Get file by ID from database
  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "error_c"}},
          {"field": {"Name": "preview_c"}},
          {"field": {"Name": "file_content_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        return null;
      }

      const file = response.data;
      return {
        id: file.Id,
        name: file.Name,
        size: file.size_c,
        type: file.type_c,
        status: file.status_c,
        progress: file.progress_c,
        uploadedAt: file.uploaded_at_c,
        error: file.error_c,
        preview: file.preview_c,
        fileContent: file.file_content_c
      };
    } catch (error) {
      console.error(`Error fetching file ${id}:`, error);
      return null;
    }
  }

  // Create file record in database
  async create(fileData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: fileData.name,
          size_c: fileData.size,
          type_c: fileData.type,
          status_c: fileData.status || "preparing",
          progress_c: fileData.progress || 0,
          uploaded_at_c: fileData.uploadedAt || new Date().toISOString(),
          error_c: fileData.error || "",
          preview_c: fileData.preview || [],
          file_content_c: fileData.fileContent || []
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return {
            id: result.data.Id,
            ...fileData
          };
        } else {
          throw new Error(result.message || "Failed to create file record");
        }
      }

      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating file record:", error);
      throw error;
    }
  }

  // Update file record in database
  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.name && { Name: updateData.name }),
          ...(updateData.status && { status_c: updateData.status }),
          ...(updateData.progress !== undefined && { progress_c: updateData.progress }),
          ...(updateData.error !== undefined && { error_c: updateData.error }),
          ...(updateData.preview && { preview_c: updateData.preview }),
          ...(updateData.fileContent && { file_content_c: updateData.fileContent })
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to update file record");
        }
      }

      return null;
    } catch (error) {
      console.error(`Error updating file ${id}:`, error);
      throw error;
    }
  }

  // Remove file from database
  async remove(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        return result.success;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting file ${id}:`, error);
      return false;
    }
  }

  // Clear all files from database
  async clearAll() {
    try {
      const files = await this.getAll();
      const fileIds = files.map(f => f.id);
      
      if (fileIds.length === 0) {
        return true;
      }

      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: fileIds
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error clearing all files:", error);
      return false;
    }
  }

  // Handle file upload with progress updates
  async uploadFile(file, onProgress) {
    try {
      // Create initial file record
      const fileRecord = await this.create({
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
        uploadedAt: new Date().toISOString()
      });

      // Simulate upload progress (in real implementation, this would be actual upload)
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;
        
        this.update(fileRecord.id, { progress, status: progress >= 100 ? "completed" : "uploading" });
        
        if (onProgress) {
          onProgress({
            ...fileRecord,
            progress,
            status: progress >= 100 ? "completed" : "uploading"
          });
        }
        
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);

      return fileRecord;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // Update file status
  async updateStatus(id, status, progress = null, error = null) {
    const updateData = { status };
    if (progress !== null) updateData.progress = progress;
    if (error !== null) updateData.error = error;
    
    return await this.update(id, updateData);
  }
}

// Export singleton instance
const uploadService = new UploadService();
export default uploadService;
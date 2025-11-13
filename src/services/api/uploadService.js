import uploadConfigData from "@/services/mockData/uploadConfig.json";
import uploadedFilesData from "@/services/mockData/uploadedFiles.json";
import { simulateFileUpload } from "@/utils/uploadUtils";
import { generateFileId, createFilePreview } from "@/utils/fileUtils";

class UploadService {
  constructor() {
    this.files = [...uploadedFilesData];
    this.config = { ...uploadConfigData };
  }

  // Simulate network delay
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get upload configuration
  async getConfig() {
    await this.delay(200);
    return { ...this.config };
  }

  // Get all uploaded files
  async getAll() {
    await this.delay(300);
    return [...this.files];
  }

  // Get file by ID
  async getById(id) {
    await this.delay(200);
    const file = this.files.find(f => f.Id === parseInt(id));
    return file ? { ...file } : null;
  }

  // Start file upload process
  async uploadFile(file, onProgress) {
    await this.delay(100);
    
    // Create file record
    const newFile = {
      Id: this.getNextId(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
      uploadedAt: new Date().toISOString(),
      preview: await createFilePreview(file)
    };
    
    this.files.push(newFile);
    
    try {
      // Simulate upload with progress updates
      await simulateFileUpload(file, (progress) => {
        newFile.progress = progress;
        if (onProgress) {
          onProgress(newFile);
        }
      });
      
      // Mark as completed
      newFile.status = "completed";
      newFile.progress = 100;
      
      return { ...newFile };
    } catch (error) {
      // Mark as failed
      newFile.status = "error";
      newFile.error = error.message;
      throw error;
    }
  }

  // Remove uploaded file
  async remove(id) {
    await this.delay(200);
    const index = this.files.findIndex(f => f.Id === parseInt(id));
    if (index > -1) {
      this.files.splice(index, 1);
      return true;
    }
    return false;
  }

  // Clear all files
  async clearAll() {
    await this.delay(300);
    this.files = [];
    return true;
  }

  // Update file status
  async updateStatus(id, status, progress = null, error = null) {
    await this.delay(100);
    const file = this.files.find(f => f.Id === parseInt(id));
    if (file) {
      file.status = status;
      if (progress !== null) file.progress = progress;
      if (error !== null) file.error = error;
      return { ...file };
    }
    return null;
  }

  // Get next available ID
  getNextId() {
    const maxId = this.files.reduce((max, file) => Math.max(max, file.Id), 0);
    return maxId + 1;
  }
}

// Create and export service instance
const uploadService = new UploadService();
export default uploadService;
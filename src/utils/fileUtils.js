export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (fileType) => {
  const type = fileType.toLowerCase();
  
  if (type.includes("image")) return "Image";
  if (type.includes("video")) return "Video";
  if (type.includes("audio")) return "Music";
  if (type.includes("pdf")) return "FileText";
  if (type.includes("word") || type.includes("doc")) return "FileText";
  if (type.includes("excel") || type.includes("sheet")) return "FileSpreadsheet";
  if (type.includes("powerpoint") || type.includes("presentation")) return "Presentation";
  if (type.includes("zip") || type.includes("rar") || type.includes("archive")) return "Archive";
  if (type.includes("text") || type.includes("plain")) return "FileText";
  
  return "File";
};

export const isFileTypeAllowed = (file, allowedTypes) => {
  if (!allowedTypes || allowedTypes.length === 0) return true;
  
  return allowedTypes.some(type => {
    if (type.startsWith(".")) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.toLowerCase().includes(type.toLowerCase());
  });
};

export const generateFileId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createFilePreview = (file) => {
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });
};
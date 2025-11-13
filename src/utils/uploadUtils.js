export const simulateFileUpload = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate occasional upload failures (5% chance)
        if (Math.random() < 0.05) {
          reject(new Error("Upload failed due to network error"));
        } else {
          resolve();
        }
      }
      
      onProgress(progress);
    }, 100);
  });
};

export const calculateUploadSpeed = (bytesUploaded, timeElapsed) => {
  if (timeElapsed === 0) return 0;
  return bytesUploaded / timeElapsed; // bytes per second
};

export const formatUploadSpeed = (bytesPerSecond) => {
  if (bytesPerSecond === 0) return "0 B/s";
  
  const k = 1024;
  const sizes = ["B/s", "KB/s", "MB/s", "GB/s"];
  const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
  
  return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const getEstimatedTimeRemaining = (totalBytes, uploadedBytes, bytesPerSecond) => {
  if (bytesPerSecond === 0 || uploadedBytes >= totalBytes) return 0;
  
  const remainingBytes = totalBytes - uploadedBytes;
  return Math.ceil(remainingBytes / bytesPerSecond);
};

export const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
};
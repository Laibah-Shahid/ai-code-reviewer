import React, { useState } from 'react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  disabled: boolean;
  maxFiles?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, disabled, maxFiles = 5 }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const newFilesArray = Array.from(newFiles);
    
    // 1. Validate file extensions
    const allowedExtensions = ['.py', '.java'];
    const validNewFiles = newFilesArray.filter(file =>
      allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );
    const invalidFiles = newFilesArray.filter(file =>
      !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    const errorMessages: string[] = [];

    if (invalidFiles.length > 0) {
      errorMessages.push(`Invalid file type(s) rejected: ${invalidFiles.map(f => f.name).join(', ')}. Only .py and .java files are accepted.`);
    }

    // 2. Validate file count
    let filesToAdd = validNewFiles;
    const totalPotentialFiles = files.length + validNewFiles.length;

    if (totalPotentialFiles > maxFiles) {
      const spaceLeft = maxFiles - files.length;
      if (spaceLeft > 0) {
        filesToAdd = validNewFiles.slice(0, spaceLeft);
      } else {
        filesToAdd = [];
      }
      
      const filesRejectedCount = validNewFiles.length - filesToAdd.length;
      if (filesRejectedCount > 0) {
          errorMessages.push(`You can upload a maximum of ${maxFiles} files. ${filesRejectedCount} file(s) were not added.`);
      }
    }
    
    // 3. Update state
    setError(errorMessages.length > 0 ? errorMessages.join('\n') : null);

    if (filesToAdd.length > 0) {
      const updatedFiles = [...files, ...filesToAdd];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removeFile = (fileName: string) => {
    const updatedFiles = files.filter(file => file.name !== fileName);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    if (updatedFiles.length < maxFiles) {
        setError(null);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-400 mb-2">
        Upload Code Files (Max {maxFiles})
      </label>
      <div 
        className={`relative p-6 border-2 border-dashed rounded-md transition-colors duration-200 ${dragActive ? 'border-cyan-500 bg-gray-800/50' : 'border-gray-600 hover:border-cyan-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled || files.length >= maxFiles}
          accept=".py,.java,text/x-python,text/x-java-source"
        />
        <label htmlFor="file-upload" className={`flex flex-col items-center justify-center space-y-2 ${disabled || files.length >= maxFiles ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h4l3 3h6a4 4 0 014 4v7a4 4 0 01-4 4H7z" />
          </svg>
          <p className="text-gray-400">
            <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Python (.py) or Java (.java) files</p>
        </label>
      </div>

      {error && <p className="text-sm text-red-400 mt-2 whitespace-pre-wrap">{error}</p>}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-gray-300">Selected files:</h4>
          <ul className="max-h-48 overflow-y-auto bg-gray-800/50 p-3 rounded-md divide-y divide-gray-700">
            {files.map((file) => (
              <li key={file.name} className="text-sm text-gray-300 flex justify-between items-center py-2">
                <span className="truncate pr-2">{file.name} - {(file.size / 1024).toFixed(2)} KB</span>
                {!disabled && (
                  <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-400 transition-colors flex-shrink-0" aria-label={`Remove ${file.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
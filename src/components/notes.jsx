import { useRef, useState, useEffect } from 'react';

function FileUpload() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    e.target.value = ''; // allow re-selecting same file
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    // previewUrl is automatically cleaned up by the useEffect below
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Create / revoke the blob URL whenever the file changes
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    };
  }, [selectedFile]);

  // Helper to format size (e.g., 116 KB)
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="mx-auto max-w-[600px] p-5">
      
      {/* The Attachment Card Preview */}
      {selectedFile && (
        <div className="mb-4 flex max-w-[280px] items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
          {/* Thumbnail / Icon */}
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
            {selectedFile.type.startsWith('image/') ? (
              <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
            ) : (
              /* Generic document icon for audio/video/other */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            )}
          </div>

          {/* File Info (Name + Size) */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-gray-900">{selectedFile.name}</div>
            <div className="text-[11px] text-gray-500">{formatFileSize(selectedFile.size)}</div>
          </div>

          {/* Remove Button (X) */}
          <button onClick={handleRemoveFile} className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-gray-100 p-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center gap-2 rounded-3xl border border-gray-200 bg-white px-3 py-2">
        <button onClick={handleFileButtonClick} className="flex cursor-pointer items-center border-0 bg-transparent p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
          </svg>
        </button>
        
        <input
          type="text"
          placeholder="What's your car doing?"
          className="min-w-0 flex-1 border-0 text-sm text-gray-900 outline-none"
        />

        <button className="flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-[#4b8b6e]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,audio/*,video/*"
        className="hidden"
      />
    </div>
  );
}

export default FileUpload;
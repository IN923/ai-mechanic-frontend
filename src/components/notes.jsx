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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* The Attachment Card Preview */}
      {selectedFile && (
        <div style={styles.card}>
          {/* Thumbnail / Icon */}
          <div style={styles.thumbnailContainer}>
            {selectedFile.type.startsWith('image/') ? (
              <img src={previewUrl} alt="preview" style={styles.thumbnailImage} />
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
          <div style={styles.infoContainer}>
            <div style={styles.fileName}>{selectedFile.name}</div>
            <div style={styles.fileSize}>{formatFileSize(selectedFile.size)}</div>
          </div>

          {/* Remove Button (X) */}
          <button onClick={handleRemoveFile} style={styles.removeButton}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Input Area */}
      <div style={styles.inputArea}>
        <button onClick={handleFileButtonClick} style={styles.attachButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
          </svg>
        </button>
        
        <input
          type="text"
          placeholder="What's your car doing?"
          style={styles.textInput}
        />

        <button style={styles.sendButton}>
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
        style={{ display: 'none' }}
      />
    </div>
  );
}

// Inline styles to match your screenshot exactly
const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    maxWidth: '280px',
    marginBottom: '16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  thumbnailContainer: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  infoContainer: {
    flex: 1,
    minWidth: 0, // Crucial for text-overflow: ellipsis to work
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  fileName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#111827',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  fileSize: {
    fontSize: '11px',
    color: '#6b7280',
  },
  removeButton: {
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    padding: 0,
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '24px',
    backgroundColor: '#ffffff',
  },
  attachButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#111827',
  },
  sendButton: {
    backgroundColor: '#4b8b6e', // The green from your screenshot
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
};

export default FileUpload;
import { ArrowUp, Paperclip, FileText, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
export default function MessageComposer({ setMessages,setIsDiagnose }) {

  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const textareaRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null);
  // const [textFile, setTextFile] = useState(null);
  const fileInputRef = useRef(null)
  // const [attachment,setAttachment] = 

  const handleFileButtonClick = (e) => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return;
    setSelectedFile(file)
    console.log("selected file=", selectedFile)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

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

  // Decide which preview to render
  const renderPreview = () => {
    if (!selectedFile || !previewUrl) return null;

    const type = selectedFile.type;

    if (type.startsWith('image/')) {
      return (
        <img
          src={previewUrl}
          alt="preview"
          style={{ maxWidth: 300, maxHeight: 300, borderRadius: 8 }}
        />
      );
    }

    if (type.startsWith('audio/')) {
      return <audio src={previewUrl} controls />;
    }

    if (type.startsWith('video/')) {
      return (
        <video
          src={previewUrl}
          controls
          style={{ maxWidth: 400, borderRadius: 8 }}
        />
      );
    }

    return <p>No preview available for this file type.</p>;
  }

  const getFileTypeLabel = (file) => {
    if (!file) return

    const type = file.type;

    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('audio/')) return 'Audio';
    if (type.startsWith('video/')) return 'Video';
    if (type === 'application/pdf') return 'PDF';
    if (type.startsWith('text/')) return 'Text';

    // fallback to extension
    const ext = file.name.split('.').pop()?.toUpperCase();
    return ext || 'File';
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter → allow default (inserts newline)
        return;
      }
      // Enter alone → send
      e.preventDefault();
      SendMessage();
    }
  };

  const SendMessage = async (e) => {

    const conversation_id = localStorage.getItem('conversation_id') || ''

    let gemini_query;
    let fileId;
    if (selectedFile) {
      console.log("file info=", selectedFile, getFileTypeLabel(selectedFile), selectedFile.type)
    }

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile)
        formData.append('mime_type', selectedFile.type)
        formData.append('file_type', getFileTypeLabel(selectedFile))
        formData.append('conversation_id', conversation_id)

        const fileUploadResponse = await axiosClient.post('/api/upload/', formData);
        fileId = fileUploadResponse.data.file_id
        console.log("uploaded file=", fileUploadResponse.data)
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message');
      }
    }

    console.log("fileidddddd=",fileId)

    if (!conversation_id) {
      gemini_query = axiosClient.post('/api/chat/', {
        conversation_id:conversation_id,
        message: message,
        file_id: fileId||''
      });
    }
    else {
      gemini_query = axiosClient.post(`/api/chat/`, {
        conversation_id:conversation_id,
        message: message,
        file_id: fileId || ''
      });
    }

    console.log("gemini query=", gemini_query)

    try {
      const response = await gemini_query;
      console.log('Response:', response.data);
      if (response.data.output[2]['conversation_id']) {
        localStorage.setItem('conversation_id',response.data.output[2]['conversation_id']);
      }
      console.log("output=", typeof (response.data.output[0]), typeof setMessages)
      setMessages((initialMessages) => {
        console.log("output=", response.data.output[0])
        return [...initialMessages, response.data.output[0], response.data.output[1]]
      })
      setIsDiagnose(response.data.output[2]['diagnose'])
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  }

  return (
    <div className="composer-area">

      {/* The Attachment Card Preview */}
      {selectedFile && (
        <div className="flex items-center gap-3 py-2 px-3 border border-gray-200 rounded-xl bg-white max-w-70 mb-4 shadow-sm">

          {/* Thumbnail / Icon */}
          <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {selectedFile.type.startsWith('image/') ? (
              <img
                src={previewUrl}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              /* Generic document icon for audio/video/other */
              <FileText size={24} className="text-gray-500" />
            )}
          </div>

          {/* File Info (Name + Size) */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <div className="text-[13px] font-medium text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
              {selectedFile.name}
            </div>
            <div className="text-[11px] text-gray-500">
              {formatFileSize(selectedFile.size)}
            </div>
          </div>

          {/* Remove Button (X) */}
          <button
            onClick={handleRemoveFile}
            className="bg-gray-100 hover:bg-gray-200 border-none rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shrink-0 p-0 transition-colors"
            aria-label="Remove file"
          >
            <X size={14} className="text-gray-400" />
          </button>
        </div>
      )}

      <div className="composer">
        <input type='file' ref={fileInputRef} onChange={handleFileChange} className='hidden' />
        <button className="icon-button attachment-button" type="button" aria-label="Attach a file" onClick={handleFileButtonClick}>
          <Paperclip size={20} strokeWidth={1.9} />
        </button>
        <textarea aria-label="Message" placeholder="What's your car doing?" rows={1} ref={textareaRef} onKeyDown={handleKeyDown} onChange={handleMessageChange} value={message} className='max-h-50 min-h-1.5 overflow-y-auto' />
        <button className="send-button"
          type="button" aria-label="Send message" onClick={SendMessage}>
          <ArrowUp size={20} strokeWidth={2.1} />
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <p className="keyboard-hint">
        <span>Enter to send</span>
        <span aria-hidden="true">·</span>
        <span>Shift + Enter for a new line</span>
      </p>
    </div>
  );
}


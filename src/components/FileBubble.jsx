import {FileText } from 'lucide-react';

function FileBubble({ fileUrl, fileName, fileType, fileSize, isUser }) {
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const formatFileSize = (bytes)=> {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

  if (!fileUrl) return null;
    
  console.log("fileuuuuuuuu=",fileUrl,apiUrl,fileType,fileType?.startsWith('image/'))
  // ── Image ──
//   if (fileType === 'image') {
//     return (
//       <img
//         src={`${VITE_API_BASE_URL}/${fileUrl}`}
//         alt={fileName}
//         className="rounded-[10px] max-w-65 max-h-65 object-cover block"
//       />
//     );
//   }

  if (fileType?.startsWith('image/')) {
    return (
      <img
        src={`${apiUrl}${fileUrl}`}
        alt={fileName}
        className="rounded-[10px] max-w-65 max-h-65 object-cover block"
      />
    );
  }

  // ── Audio ──
  if (fileType?.startsWith('audio/')) {
    return (
      <audio
        src={`${apiUrl}${fileUrl}`}
        controls
        className="w-65 rounded-lg outline-none"
      />
    );
  }

  // ── Video ──
  if (fileType?.startsWith('video/')) {
    return (
      <video
        src={`${apiUrl}${fileUrl}`}
        controls
        className="rounded-[10px] max-w-75 max-h-75 block"
      />
    );
  }

  // ── Generic file (PDF, doc, zip, etc.) ──
//   return (
//     <a
//       href={fileUrl}
//       target="_blank"
//       rel="noopener noreferrer"
//       className={`flex items-center gap-3 rounded-[10px] p-2 pr-3 max-w-70 no-underline transition-colors ${
//         isUser ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
//       }`}
//     >
//       <div
//         className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
//           isUser ? 'bg-white/20' : 'bg-white'
//         }`}
//       >
//         <FileText size={18} className={isUser ? 'text-white' : 'text-gray-600'} />
//       </div>
//       <div className="min-w-0 flex flex-col gap-0.5">
//         {/* <div
//           className={`text-[13px] font-medium truncate ${
//             isUser ? 'text-white' : 'text-gray-900'
//           }`}
//           title={fileName}
//         >
//           {fileName}
//         </div> */}
//         <div
//           className={`text-[11px] ${
//             isUser ? 'text-white/70' : 'text-gray-500'
//           }`}
//         >
//           {formatFileSize(fileSize)}
//         </div>
//       </div>
//     </a>
//   );
}

export default FileBubble;
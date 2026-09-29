import React, { useState, useEffect } from 'react';
import { Wrench, CircleUser, FileText } from 'lucide-react';
import FileBubble from './FileBubble';

const ChatMessageItem = ({ message }) => {
  const isUser = message.role === 'user';
  console.log("isUser=", isUser, message);

  const hasText = Boolean(message.text && message.text.trim());
  const hasFile = Boolean(message.file);

  // Nothing to show → skip
  if (!hasText && !hasFile) return null;

  console.log("printedddddddddddddd=", "hasText=", hasText, "hasFile=", hasFile, isUser)
  if (isUser) {
    console.log("i am going to print user")
    return (
      <div className="flex items-start justify-end gap-3.5 max-w-[92%] sm:max-w-[85%] ml-auto">
        {/* User Message Content Block */}
        <div className="flex flex-col items-end min-w-0">
          <div
            className={`rounded-tl-[18px] rounded-tr-[18px] rounded-br-[4px] rounded-bl-[18px] bg-[#1F4239] text-white text-[14.5px] sm:text-[15px] leading-relaxed font-normal shadow-[0_1px_2px_rgba(0,0,0,0.04)] max-w-full ${hasFile ? 'p-1' : 'px-5 py-3.5'
              }`}
          >
            {/* {hasFile && (
              <FileBubble
                fileUrl={message.file}
                fileName={message.file_name}
                fileType={message.file_type}
                fileSize={message.file_size}
                isUser={true}
              />
            )} */}
            {hasFile && (
              <FileBubble
                fileUrl={message.file}
                fileName=''
                fileType={message.file_type}
                fileSize=''
                isUser={true}
              />
            )}

            {hasText && (
              <p className={hasFile ? 'px-4 pb-3 pt-2.5 wrap-break-word' : 'wrap-break-word'}>
                {message.text}
              </p>
            )}
          </div>
          {/* Subtext info */}
          <div className="mt-1.5 pr-1 text-[11.5px] sm:text-[12px] text-[#8e959e] font-normal tracking-wide text-right select-none flex items-center gap-1">
            <span>{message.senderName || 'You'}</span>
            <span className="mx-0.5">·</span>
            <span>{message.timestamp}</span>
          </div>
        </div>

        {/* User Initials Badge */}
        <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EFE8DC] text-[#786D5E] flex items-center justify-center text-xs sm:text-sm font-semibold mt-0.5 select-none">
          <CircleUser />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3.5 max-w-[92%] sm:max-w-[85%]">
      {/* Technician Wrench Badge */}
      <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E2ECE4] text-[#5F8D6D] flex items-center justify-center mt-0.5 select-none">
        <Wrench className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
      </div>

      {/* Technician Message Content Block */}
      <div className="flex flex-col items-start min-w-0">
        <div
          className={`rounded-tl-[18px] rounded-tr-[18px] rounded-br-[18px] rounded-bl-[4px] bg-white text-[#2B2D31] border border-[#E8ECEF] text-[14.5px] sm:text-[15px] leading-relaxed font-normal shadow-[0_1px_2px_rgba(0,0,0,0.02)] max-w-full ${hasFile ? 'p-1' : 'px-5 py-3.5'
            }`}
        >
          {hasFile && (
            <FileBubble
              fileUrl={message.file_url}
              fileName={message.file_name}
              fileType={message.file_type}
              fileSize={message.file_size}
              isUser={false}
            />
          )}
          {hasText && (
            <p className={hasFile ? 'px-4 pb-3 pt-2.5 wrap-break-word' : 'wrap-break-word'}>
              {message.text}
            </p>
          )}
        </div>
        {/* Subtext info */}
        <div className="mt-1.5 pl-1 text-[11.5px] sm:text-[12px] text-[#8e959e] font-normal tracking-wide select-none flex items-center gap-1">
          <span>{message.senderName || 'Senior technician'}</span>
          <span className="mx-0.5">·</span>
          <span>{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem;

// export const ChatMessageList = ({ messages = DEFAULT_MESSAGES }) => {
//   const displayMessages = messages.length > 0 ? messages : DEFAULT_MESSAGES;

//   return (
//     <div className="flex flex-col space-y-6 sm:space-y-7 py-4 w-full">
//       {displayMessages.map((msg, index) => (
//         <ChatMessageItem key={msg.id || index} message={msg} />
//       ))}
//     </div>
//   );
// };

// export default function App() {
//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-3 sm:p-6 antialiased font-sans">
//       <div className="w-full max-w-240 mx-auto my-auto">
//         <ChatMessageList />
//       </div>
//     </div>
//   );
// }

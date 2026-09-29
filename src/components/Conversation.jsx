import { useState } from 'react';
import DiagnoseButton from './DiagnoseButton.jsx';
import BookMechanicButton from './BookMechanicButton.jsx';
import BookingModal from './BookingModal.jsx';
import ChatMessageItem from './ChatMessageItem.jsx';

export default function Conversation({ messages, isdiagnose, setMessages, isTyping }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  console.log("message list=", messages)
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pt-7 pb-[22px] max-[760px]:px-[13px] max-[760px]:pt-[23px] max-[760px]:pb-[18px]">
      <div className="flex flex-1 flex-col gap-5 max-[760px]:gap-[17px]">
        {messages.map((message) => {
          return <ChatMessageItem key={message.id} message={message} />
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        
      </div>
      <div className="mt-[23px] flex justify-end gap-3 border-t border-[#e7ebe6] pt-4 max-[760px]:mt-[19px] max-[760px]:gap-[9px] max-[760px]:pt-[13px] max-[430px]:flex-wrap">
        <DiagnoseButton isdiagnose={isdiagnose} setMessages={setMessages} />
        <BookMechanicButton onBook={() => setBookingOpen(true)} />
      </div>
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

import { useState } from 'react';
// import { messages as initialMessages } from '../data/messages.js';
import DiagnoseButton from './DiagnoseButton.jsx';
import BookMechanicButton from './BookMechanicButton.jsx';
import BookingModal from './BookingModal.jsx';
import ChatMessageItem from './ChatMessageItem.jsx';

export default function Conversation({ messages, isdiagnose, setMessages }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  console.log("message list=", messages)
  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-7 pt-7 pb-[22px] max-[760px]:px-[13px] max-[760px]:pt-[23px] max-[760px]:pb-[18px]">
      <div className="flex flex-1 flex-col gap-5 max-[760px]:gap-[17px]">
        {messages.map((message) => {
          return <ChatMessageItem key={message.id} message={message} />
        })}
      </div>
      <div className="mt-[23px] flex justify-end gap-3 border-t border-[#e7ebe6] pt-4 max-[760px]:mt-[19px] max-[760px]:gap-[9px] max-[760px]:pt-[13px] max-[430px]:flex-wrap">
        <DiagnoseButton isdiagnose={isdiagnose} setMessages={setMessages} />
        <BookMechanicButton onBook={() => setBookingOpen(true)} />
      </div>
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

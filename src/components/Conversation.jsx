import { useState } from 'react';
// import { messages as initialMessages } from '../data/messages.js';
import MessageBubble from './MessageBubble.jsx';
import DiagnoseButton from './DiagnoseButton.jsx';
import BookMechanicButton from './BookMechanicButton.jsx';
import BookingModal from './BookingModal.jsx';
import ChatMessageItem from './ChatMessageItem.jsx';

export default function Conversation({ messages, isdiagnose, setMessages }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  console.log("message list=", messages)
  return (
    <div className="conversation">
      <div className="message-list">
        {messages.map((message) => {
          return <ChatMessageItem key={message.id} message={message} />
        })}
      </div>
      <div className="action-row">
        <DiagnoseButton isdiagnose={isdiagnose} setMessages={setMessages} />
        <BookMechanicButton onBook={() => setBookingOpen(true)} />
      </div>
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

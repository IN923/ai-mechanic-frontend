import { Wrench } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isDriver = message.author === 'driver';

  return (
    <article className={`message-row ${isDriver ? 'message-row-driver' : 'message-row-technician'}`}>
      {!isDriver && (
        <div className="avatar avatar-technician" aria-hidden="true">
          <Wrench size={15} strokeWidth={2.2} />
        </div>
      )}
      <div className="message-content">
        <div className={`message-bubble ${isDriver ? 'bubble-driver' : 'bubble-technician'}`}>
          {message.text}
        </div>
        <div className="message-meta">
          <span>{isDriver ? 'You' : 'Senior technician'}</span>
          <span aria-hidden="true">·</span>
          <time>{message.time}</time>
        </div>
      </div>
      {isDriver && (
        <div className="avatar avatar-driver" aria-label="Driver initials">
          JD
        </div>
      )}
    </article>
  );
}

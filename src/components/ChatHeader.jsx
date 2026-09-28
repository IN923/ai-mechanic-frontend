import { Wrench } from 'lucide-react';

export default function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="technician-profile">
        <div className="avatar avatar-technician avatar-header" aria-hidden="true">
          <Wrench size={19} strokeWidth={2.2} />
        </div>
        <div>
          <h1>Senior technician</h1>
          <p>Working through the symptoms with you</p>
        </div>
      </div>
    </header>
  );
}

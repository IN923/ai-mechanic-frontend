import { useState, useEffect } from 'react'
import ChatHeader from './components/ChatHeader';
import Conversation from './components/Conversation';
import MessageComposer from './components/MessageComposer';
import PageFooter from './components/PageFooter';

// const DEFAULT_MESSAGES = [
//   {
//     id: 'msg-1',
//     senderName: 'Senior technician',
//     role: 'AI',
//     timestamp: '9:43 AM',
//     text: "Thanks — let's narrow it down before guessing at parts. Does the vibration happen in Park, in Drive with your foot on the brake, or both? And does it smooth out once you’re moving?"
//   },
//   {
//     id: 'msg-2',
//     senderName: 'You',
//     role: 'user',
//     timestamp: '9:45 AM',
//     text: "Mostly in Drive at a stop. It's there in Park too, but not as noticeable. It does smooth out when I accelerate."
//   },
//   {
//     id: 'msg-3',
//     senderName: 'Senior technician',
//     role: 'AI',
//     timestamp: '9:46 AM',
//     text: "That's helpful. A couple more checks: roughly how many miles are on it, and when were the spark plugs last replaced? Any recent drop in fuel economy, hard starts, or unusual exhaust smell?"
//   },
//   {
//     id: 'msg-4',
//     senderName: 'You',
//     role: 'user',
//     timestamp: '9:49 AM',
//     text: "About 86,000 miles. I'm not sure about the plugs — I bought it used. Starts fine and mileage seems normal. No odd smell."
//   }
// ];

function App() {

  const [messages, setMessages] = useState([]);
  // const [file, setFile] = useState('')
  const [isdiagnose, setIsDiagnose] = useState(false)
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    console.log("messages innnnnn", messages)
  }, [messages])

  return (
    <main className="h-screen min-w-[320px] w-full flex flex-col justify-center bg-[#f4f6f2] px-5 pt-6 pb-4.5 font-['DM_Sans',sans-serif] text-[#34423d] antialiased max-[760px]:justify-start max-[760px]:px-[10px] max-[760px]:py-3">
      <section className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-[22px] border border-[#dce3dc] bg-[#fbfcfa] shadow-[0_18px_48px_rgba(61,78,68,0.09)] max-[760px]:rounded-[17px]" aria-label="Mechanic support chat">
        <ChatHeader />
        <Conversation messages={messages} isdiagnose={isdiagnose} setMessages={setMessages} isTyping={isTyping} />
        <MessageComposer setMessages={setMessages} setIsTyping={setIsTyping} setIsDiagnose={setIsDiagnose} isdiagnose={isdiagnose} />
      </section>
      <PageFooter />
    </main>
  );
}

export default App

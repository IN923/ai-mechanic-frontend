import { Sparkles } from 'lucide-react';
import axios from '../api/axiosClient';

export default function DiagnoseButton({ isdiagnose,setMessages }) {

  const conversation_id = localStorage.getItem('conversation_id')
  console.log("conversation id in diagnosis=",conversation_id)
  const handleDiagnose = async (e)=>{
    const response = await axios.post('/api/diagnose/',{
      conversation_id:conversation_id
    })
    console.log("diagnose response=",response.data)
    setMessages((initialMessages)=>([...initialMessages,response.data]))
    
  }

  return (
    <button
        type="button"
        disabled={isdiagnose}
        onClick={handleDiagnose}
        className="inline-flex items-center gap-[9px] rounded-xl border-0 bg-[#bd7a2e] px-[19px] py-[11px] text-[13px] font-bold text-[#fffdf7] shadow-[0_4px_8px_rgba(146,88,27,0.18)] transition duration-150 hover:-translate-y-px hover:bg-[#a96b25] hover:shadow-[0_6px_13px_rgba(146,88,27,0.22)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:bg-gray-300 max-[760px]:px-4 max-[760px]:py-2.5 max-[430px]:text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd7a2e]"
      >
        <Sparkles size={17} strokeWidth={2.1} />
        <span>Diagnose</span>
      </button>

  );
}

import { Sparkles } from 'lucide-react';
import axios from '../api/axiosClient';

export default function DiagnoseButton({ isdiagnose,setMessages }) {

  const isDisabled = isdiagnose;
  const conversation_id = localStorage.getItem('conversation_id')
  console.log("conversation id in diagnosis=",conversation_id)
  const handleDiagnose = async (e)=>{
    const response = await axios.post('/api/diagnose/',{
      conversation_id:conversation_id
    })

    setMessages((initialMessages)=>([...initialMessages,response.data]))
  }

  return (
    <div className="diagnosis-row">
      <button
        type="button"
        disabled={isdiagnose}
        onClick={handleDiagnose}
        className="
    inline-flex items-center gap-2 px-4 py-2 rounded-lg
    text-sm font-medium transition-colors
    bg-[#D97706] text-white hover:bg-[#B45309]
    disabled:bg-gray-300 disabled:text-gray-500
    disabled:cursor-not-allowed disabled:hover:bg-gray-300
  "
      >
        <Sparkles size={17} strokeWidth={2.1} />
        <span>Diagnose</span>
      </button>
    </div>

  );
}

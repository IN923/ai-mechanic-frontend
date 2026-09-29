import { Wrench } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isDriver = message.author === 'driver';

  return (
    <article className={`flex items-end gap-3 ${isDriver ? 'justify-end' : ''}`}>
      {!isDriver && (
        <div className="grid size-7 shrink-0 place-items-center rounded-full bg-[#dfebe1] text-[#5d806e]" aria-hidden="true">
          <Wrench size={15} strokeWidth={2.2} />
        </div>
      )}
      <div className="max-w-[min(82%,770px)]">
        <div className={`rounded-2xl px-4 py-[13px] text-[13px] leading-[1.65] ${isDriver ? 'rounded-br-[5px] bg-[#24594e] font-medium text-[#f6fbf7] shadow-[0_3px_8px_rgba(29,70,60,0.13)]' : 'rounded-bl-[5px] border border-[#e0e7df] bg-white text-[#56635d] shadow-[0_3px_12px_rgba(61,78,68,0.04)]'}`}>
          {message.text}
        </div>
        <div className={`mt-1.5 flex items-center gap-[7px] px-1.5 text-[10px] leading-[1.2] text-[#a0aaa3] ${isDriver ? 'justify-end' : ''}`}>
          <span>{isDriver ? 'You' : 'Senior technician'}</span>
          <span aria-hidden="true">·</span>
          <time>{message.time}</time>
        </div>
      </div>
      {isDriver && (
        <div className="grid size-[29px] shrink-0 place-items-center rounded-full bg-[#ebe9df] text-[10px] font-bold text-[#756e5a]" aria-label="Driver initials">
          JD
        </div>
      )}
    </article>
  );
}

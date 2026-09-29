import { Wrench } from 'lucide-react';

export default function ChatHeader() {
  return (
    <header className="flex min-h-[66px] items-center justify-between border-b border-[#e0e6e0] px-6 py-[15px] max-[760px]:min-h-16 max-[760px]:px-[15px] max-[760px]:py-[13px]">
      <div className="flex items-center gap-[14px] max-[430px]:gap-2.5">
        <div className="grid size-[38px] shrink-0 place-items-center rounded-full bg-[#dfebe1] text-[#5d806e]" aria-hidden="true">
          <Wrench size={19} strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="mb-0.5 text-sm font-bold leading-[1.2] text-[#2f4039] max-[430px]:text-[13px]">Senior technician</h1>
          <p className="text-[11px] leading-[1.3] text-[#849088] max-[430px]:max-w-[155px] max-[430px]:text-[10px]">Working through the symptoms with you</p>
        </div>
      </div>
    </header>
  );
}

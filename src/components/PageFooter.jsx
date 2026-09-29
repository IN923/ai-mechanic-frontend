import { ShieldCheck } from 'lucide-react';

export default function PageFooter() {
  return (
    <footer className="flex items-center justify-between gap-[18px] px-1 pt-[15px] text-[10px] leading-[1.5] text-[#8c988f] max-[760px]:items-start max-[760px]:flex-col max-[760px]:gap-[7px] max-[760px]:pt-3 max-[760px]:text-[9px]">
      <p className="m-0">Guidance is based on symptoms shared here; a hands-on inspection is the reliable next step.</p>
      <p className="m-0 flex items-center gap-1.5 whitespace-nowrap">
        <ShieldCheck size={15} strokeWidth={2} />
        <span>Your vehicle details stay in this demo</span>
      </p>
    </footer>
  );
}

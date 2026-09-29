import { CalendarClock } from 'lucide-react';

export default function BookMechanicButton({ onBook }) {
  return (
    <button className="inline-flex items-center gap-[9px] rounded-xl border border-[#cdd8cd] bg-[#e3eae3] px-[19px] py-[11px] text-[13px] font-bold text-[#2f4039] shadow-[0_3px_7px_rgba(61,78,68,0.06)] transition duration-150 hover:-translate-y-px hover:bg-[#d4e0d5] hover:shadow-[0_5px_11px_rgba(61,78,68,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5d806e] max-[760px]:px-4 max-[760px]:py-2.5 max-[430px]:text-xs" type="button" onClick={onBook}>
      <CalendarClock size={17} strokeWidth={2.1} />
      <span>Book mechanic</span>
    </button>
  );
}

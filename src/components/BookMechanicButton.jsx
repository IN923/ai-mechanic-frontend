import { CalendarClock } from 'lucide-react';

export default function BookMechanicButton({ onBook }) {
  return (
    <button className="book-button" type="button" onClick={onBook}>
      <CalendarClock size={17} strokeWidth={2.1} />
      <span>Book mechanic</span>
    </button>
  );
}

import { ShieldCheck } from 'lucide-react';

export default function PageFooter() {
  return (
    <footer className="page-footer">
      <p>Guidance is based on symptoms shared here; a hands-on inspection is the reliable next step.</p>
      <p className="privacy-note">
        <ShieldCheck size={15} strokeWidth={2} />
        <span>Your vehicle details stay in this demo</span>
      </p>
    </footer>
  );
}

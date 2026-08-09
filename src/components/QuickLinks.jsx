import { CalendarPlus, Clock, HelpCircle, MapPin, Headset } from "lucide-react";

const LINKS = [
  { id: "book", label: "Book Appointment", icon: CalendarPlus },
  { id: "timings", label: "Timings", icon: Clock },
  { id: "enquiry", label: "Enquiry", icon: HelpCircle },
  { id: "address", label: "Address", icon: MapPin },
  { id: "agent", label: "Request Live Agent", icon: Headset },
];

/**
 * QuickLinks
 * ----------
 * Shortcut chips shown alongside the greeting so a patient can jump
 * straight into a common flow without typing. `onSelect(id)` is wired
 * up by ChatWidget: "book" starts the registration flow, everything
 * else is sent through the normal chat pipeline as a canned message.
 */
export default function QuickLinks({ onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-4">
      {LINKS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className="flex items-center gap-1.5 rounded-full border border-clinical-100 bg-white px-3 py-1.5 text-xs font-medium text-clinical-700 shadow-sm transition-colors hover:bg-clinical-700 hover:text-white active:scale-95"
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  );
}

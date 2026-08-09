import { CheckCircle2, Clock3 } from "lucide-react";

/**
 * BookingConfirmation
 * --------------------
 * Terminal "success" card for the booking journey: shows the doctor,
 * the confirmed slot, and the confirmation message returned by the
 * backend (or mockBookingConfirmation in mock mode).
 */
export default function BookingConfirmation({ message }) {
  const { doctor, slot, text } = message;

  return (
    <div className="flex w-full flex-col items-start gap-2 animate-pop-in">
      <div className="flex w-full max-w-[90%] flex-col gap-3 rounded-2xl border border-status-available/30 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-status-available">
          <CheckCircle2 size={20} />
          <span className="font-display text-sm font-bold">Appointment Confirmed</span>
        </div>

        {doctor && (
          <div className="flex items-center gap-3 rounded-xl bg-clinical-50 p-2">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(doctor.name);
              }}
            />
            <div className="text-xs">
              <p className="font-semibold text-ink-900">{doctor.name}</p>
              <p className="text-ink-600">{doctor.department}</p>
            </div>
          </div>
        )}

        <p className="flex items-center gap-1.5 text-xs font-medium text-ink-900">
          <Clock3 size={13} /> {slot}
        </p>

        <p className="text-xs leading-snug text-ink-600">{text}</p>
      </div>
    </div>
  );
}

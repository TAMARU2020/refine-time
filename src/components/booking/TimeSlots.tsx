import { cn } from "@/lib/utils";

interface TimeSlotsProps {
  slots: string[];
  selected: string | null;
  onSelect: (time: string) => void;
}

const TimeSlots = ({ slots, selected, onSelect }: TimeSlotsProps) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          className={cn(
            "py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 border",
            selected === slot
              ? "bg-accent text-accent-foreground border-accent shadow-sm scale-105"
              : "bg-card text-foreground border-border hover:border-accent hover:bg-secondary"
          )}
        >
          {slot}
        </button>
      ))}
    </div>
  );
};

export default TimeSlots;

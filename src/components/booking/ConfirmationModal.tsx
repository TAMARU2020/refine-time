import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Check, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types/appointment";
import { playConfirmationSound } from "@/lib/sounds";
import { useToast } from "@/hooks/use-toast";

interface ConfirmationModalProps {
  appointment: Appointment;
  onClose: () => void;
}

const ConfirmationModal = ({ appointment, onClose }: ConfirmationModalProps) => {
  const { toast } = useToast();

  useEffect(() => {
    playConfirmationSound();
  }, []);

  const copyDetails = () => {
    const details = `📅 תור במספרה
שם: ${appointment.name}
תאריך: ${format(parseISO(appointment.date), "dd/MM/yyyy")}
שעה: ${appointment.time}
${appointment.note ? `הערה: ${appointment.note}` : ""}`.trim();

    navigator.clipboard.writeText(details);
    toast({ title: "הפרטים הועתקו!", description: "פרטי התור הועתקו ללוח" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center animate-scale-in">
              <Check className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
        </div>

        <div className="text-center mb-6" dir="rtl">
          <h3 className="font-display text-2xl font-bold text-foreground mb-1">התור נקבע בהצלחה!</h3>
          <p className="text-sm text-muted-foreground">נתראה בקרוב</p>
        </div>

        <div className="bg-secondary rounded-xl p-5 space-y-3 mb-6" dir="rtl">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">שם</span>
            <span className="text-sm font-medium text-foreground">{appointment.name}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">תאריך</span>
            <span className="text-sm font-medium text-foreground">
              {format(parseISO(appointment.date), "dd/MM/yyyy")}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">שעה</span>
            <span className="text-sm font-medium text-foreground">{appointment.time}</span>
          </div>
          {appointment.note && (
            <>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">הערה</span>
                <span className="text-sm font-medium text-foreground">{appointment.note}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="gold" className="flex-1" onClick={copyDetails}>
            <Copy className="w-4 h-4" />
            העתק פרטים
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            סגור
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

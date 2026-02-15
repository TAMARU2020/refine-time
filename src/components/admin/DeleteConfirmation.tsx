import { useState } from "react";
import { format, parseISO } from "date-fns";
import { AlertTriangle, User, Phone, Clock, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Appointment } from "@/types/appointment";

interface DeleteConfirmationProps {
  appointment: Appointment;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation = ({ appointment, onConfirm, onCancel }: DeleteConfirmationProps) => {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmed = confirmText === "DELETE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md animate-scale-in border border-border overflow-hidden">
        {/* Warning header */}
        <div className="bg-destructive/10 px-6 py-5 flex items-center gap-3 border-b border-destructive/20">
          <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">מחיקת תור</h3>
            <p className="text-sm text-muted-foreground">פעולה זו אינה ניתנת לביטול</p>
          </div>
        </div>

        {/* Appointment details */}
        <div className="px-6 py-5 space-y-4">
          <div className="bg-secondary rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-accent shrink-0" />
              <span className="font-medium text-foreground">{appointment.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <span className="text-muted-foreground">{appointment.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-accent shrink-0" />
              <span className="text-muted-foreground">{appointment.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-accent shrink-0" />
              <span className="text-muted-foreground">{appointment.time}</span>
            </div>
            {appointment.note && (
              <div className="flex items-center gap-3 text-sm">
                <MessageSquare className="w-4 h-4 text-accent shrink-0" />
                <span className="text-muted-foreground">{appointment.note}</span>
              </div>
            )}
          </div>

          {/* Type DELETE */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              הקלד <span className="font-bold text-destructive font-mono">DELETE</span> לאישור המחיקה
            </label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="הקלד DELETE כאן"
              className="text-center font-mono tracking-widest"
              dir="ltr"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            ביטול
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={!isConfirmed}
          >
            מחק תור
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;

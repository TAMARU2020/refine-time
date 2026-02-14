import { useState, useEffect } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { CalendarIcon, User, Phone, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { generateTimeSlots, addAppointment, hasAvailability, isDayBlocked } from "@/lib/store";
import { Appointment } from "@/types/appointment";
import TimeSlots from "./TimeSlots";
import ConfirmationModal from "./ConfirmationModal";

const BookingForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastBooking, setLastBooking] = useState<Appointment | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      const slots = generateTimeSlots(dateStr);
      setAvailableSlots(slots);
      setTime(null);
    }
  }, [date]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "נא להזין שם מלא";
    if (!phone.trim() || phone.length < 9) errs.phone = "נא להזין מספר טלפון תקין";
    if (!date) errs.date = "נא לבחור תאריך";
    if (!time) errs.time = "נא לבחור שעה";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const isFormValid = name.trim() && phone.trim() && phone.length >= 9 && date && time;

  const handleSubmit = async () => {
    if (!validate() || !date || !time) return;
    setIsLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const appt: Appointment = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: phone.trim(),
      date: format(date, "yyyy-MM-dd"),
      time,
      duration: 30,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    addAppointment(appt);
    setLastBooking(appt);
    setIsLoading(false);
    setShowConfirmation(true);

    // Reset form
    setName("");
    setPhone("");
    setDate(undefined);
    setTime(null);
    setNote("");
    setAvailableSlots([]);
  };

  const isDateDisabled = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return true;
    const dateStr = format(d, "yyyy-MM-dd");
    return isDayBlocked(dateStr) || !hasAvailability(dateStr);
  };

  return (
    <div className="animate-fade-in">
      <div className="card-premium p-6 md:p-8 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">הזמנת תור</h2>
          <div className="section-divider mb-3" />
          <p className="text-sm text-muted-foreground">בחר תאריך ושעה שנוחים לך</p>
        </div>

        <div className="space-y-5" dir="rtl">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">שם מלא</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הזן את שמך המלא"
                className="pr-10 text-right"
              />
            </div>
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">מספר טלפון</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9-+]/g, ""))}
                placeholder="050-1234567"
                className="pr-10 text-right"
                type="tel"
              />
            </div>
            {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">תאריך</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : "בחר תאריך"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={isDateDisabled}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-destructive text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Time Slots */}
          {date && (
            <div className="animate-fade-in">
              <label className="text-sm font-medium text-foreground mb-1.5 block">שעה</label>
              {availableSlots.length > 0 ? (
                <TimeSlots
                  slots={availableSlots}
                  selected={time}
                  onSelect={setTime}
                />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  אין שעות פנויות ביום זה
                </p>
              )}
              {errors.time && <p className="text-destructive text-xs mt-1">{errors.time}</p>}
            </div>
          )}

          {/* Note */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              הערה <span className="text-muted-foreground">(אופציונלי)</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="הערות מיוחדות..."
                className="pr-10 text-right min-h-[80px]"
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                שולח...
              </>
            ) : (
              "אשר תור"
            )}
          </Button>
        </div>
      </div>

      {showConfirmation && lastBooking && (
        <ConfirmationModal
          appointment={lastBooking}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default BookingForm;

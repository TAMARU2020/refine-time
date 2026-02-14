import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Search, Calendar, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAppointmentsByPhone } from "@/lib/store";
import { Appointment } from "@/types/appointment";

const FindAppointment = () => {
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<Appointment[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!phone.trim()) return;
    const found = getAppointmentsByPhone(phone.trim());
    setResults(found);
    setSearched(true);
  };

  return (
    <div className="card-premium p-6 md:p-8 max-w-lg mx-auto animate-fade-in">
      <div className="text-center mb-6" dir="rtl">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">מצא את התור שלי</h2>
        <div className="section-divider mb-3" />
        <p className="text-sm text-muted-foreground">הזן את מספר הטלפון שלך לחיפוש תורים</p>
      </div>

      <div className="flex gap-2" dir="rtl">
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9-+]/g, ""))}
          placeholder="050-1234567"
          className="text-right"
          type="tel"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button variant="gold" onClick={handleSearch} disabled={!phone.trim()}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {searched && (
        <div className="mt-6 animate-fade-in" dir="rtl">
          {results && results.length > 0 ? (
            <div className="space-y-3">
              {results.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-secondary rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="font-medium">
                      {format(parseISO(appt.date), "dd/MM/yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>{appt.time}</span>
                  </div>
                  {appt.note && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="w-4 h-4" />
                      <span>{appt.note}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                לא נמצאו תורים עתידיים עבור מספר זה
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindAppointment;

import { useState, useEffect, useCallback } from "react";
import { format, addDays, startOfWeek, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Trash2,
  Ban,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  getAppointmentsByDate,
  deleteAppointment,
  getBlockedSlots,
  addBlockedSlot,
  removeBlockedSlot,
  isDayBlocked,
  getSettings,
  updateSettings,
  getDayOccupancy,
  generateTimeSlots,
} from "@/lib/store";
import { Appointment, BlockedSlot, AppSettings } from "@/types/appointment";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmation from "./DeleteConfirmation";

type ViewMode = "day" | "week";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [blockTimeInput, setBlockTimeInput] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    setAppointments(getAppointmentsByDate(dateStr));
    setBlockedSlots(getBlockedSlots().filter((s) => s.date === dateStr));
  }, [dateStr, refreshKey]);

  const handleDeleteAppointment = (appt: Appointment) => {
    setDeletingAppointment(appt);
  };

  const confirmDelete = () => {
    if (!deletingAppointment) return;
    deleteAppointment(deletingAppointment.id);
    toast({ title: "התור נמחק" });
    setDeletingAppointment(null);
    refresh();
  };

  const handleBlockDay = () => {
    if (isDayBlocked(dateStr)) return;
    addBlockedSlot({ id: crypto.randomUUID(), date: dateStr });
    toast({ title: "היום נחסם בהצלחה" });
    refresh();
  };

  const handleBlockTime = () => {
    if (!blockTimeInput) return;
    addBlockedSlot({ id: crypto.randomUUID(), date: dateStr, time: blockTimeInput });
    setBlockTimeInput("");
    toast({ title: `השעה ${blockTimeInput} נחסמה` });
    refresh();
  };

  const handleUnblock = (id: string) => {
    removeBlockedSlot(id);
    toast({ title: "החסימה הוסרה" });
    refresh();
  };

  const handleDurationChange = (dur: number) => {
    if (dur < 10 || dur > 120) return;
    updateSettings({ slotDuration: dur });
    setSettings({ ...settings, slotDuration: dur });
    toast({ title: `משך התור עודכן ל-${dur} דקות` });
  };

  const navigateDate = (dir: number) => {
    setSelectedDate((d) => addDays(d, dir * (viewMode === "week" ? 7 : 1)));
  };

  const occupancy = getDayOccupancy(dateStr);
  const availableSlots = generateTimeSlots(dateStr);

  // Week view data
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">לוח בקרה</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("day")}
          >
            יומי
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            שבועי
          </Button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="card-premium p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigateDate(1)}>
          <ChevronRight className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="w-4 h-4 ml-2" />
                {viewMode === "day"
                  ? format(selectedDate, "dd/MM/yyyy")
                  : `${format(weekDays[0], "dd/MM")} - ${format(weekDays[6], "dd/MM")}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigateDate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      {viewMode === "week" ? (
        /* ===== WEEK VIEW ===== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const ds = format(day, "yyyy-MM-dd");
            const occ = getDayOccupancy(ds);
            const dayAppts = getAppointmentsByDate(ds);
            const blocked = isDayBlocked(ds);
            return (
              <div
                key={ds}
                className={cn(
                  "card-premium p-3 cursor-pointer transition-all hover:shadow-md",
                  ds === dateStr && "ring-2 ring-accent",
                  blocked && "opacity-60"
                )}
                onClick={() => {
                  setSelectedDate(day);
                  setViewMode("day");
                }}
              >
                <div className="text-center mb-2">
                  <p className="text-xs text-muted-foreground">
                    {format(day, "EEEE", { locale: he })}
                  </p>
                  <p className="text-lg font-bold text-foreground">{format(day, "dd")}</p>
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{dayAppts.length} תורים</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      occ >= 80 ? "bg-destructive" : occ >= 50 ? "bg-accent" : "bg-accent/50"
                    )}
                    style={{ width: `${occ}%` }}
                  />
                </div>
                <p className="text-xs text-center mt-1 text-muted-foreground">{occ}%</p>
              </div>
            );
          })}
        </div>
      ) : (
        /* ===== DAY VIEW ===== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-premium p-4 text-center">
              <Users className="w-5 h-5 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
              <p className="text-xs text-muted-foreground">תורים היום</p>
            </div>
            <div className="card-premium p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-foreground">{availableSlots.length}</p>
              <p className="text-xs text-muted-foreground">סלוטים פנויים</p>
            </div>
            <div className="card-premium p-4 text-center">
              <BarChart3 className="w-5 h-5 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-foreground">{occupancy}%</p>
              <p className="text-xs text-muted-foreground">תפוסה</p>
            </div>
            <div className="card-premium p-4 text-center">
              <Ban className="w-5 h-5 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-foreground">{blockedSlots.length}</p>
              <p className="text-xs text-muted-foreground">חסימות</p>
            </div>
          </div>

          {/* Appointment List */}
          <div className="lg:col-span-2">
            <div className="card-premium p-5">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                תורים ליום {format(selectedDate, "dd/MM/yyyy")}
              </h3>
              {appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appt) => (
                      <div
                        key={appt.id}
                        className="flex items-center justify-between bg-secondary rounded-xl p-4"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{appt.name}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{appt.time}</span>
                            <span>·</span>
                            <span>{appt.phone}</span>
                          </div>
                          {appt.note && (
                            <p className="text-xs text-muted-foreground">{appt.note}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAppointment(appt)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  אין תורים ליום זה
                </p>
              )}
            </div>
          </div>

          {/* Management Panel */}
          <div className="space-y-4">
            {/* Block Day */}
            <div className="card-premium p-5">
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">ניהול חסימות</h3>
              <Button
                variant={isDayBlocked(dateStr) ? "destructive" : "outline"}
                className="w-full mb-3"
                onClick={handleBlockDay}
                disabled={isDayBlocked(dateStr)}
              >
                <Ban className="w-4 h-4 ml-2" />
                {isDayBlocked(dateStr) ? "היום חסום" : "חסום יום שלם"}
              </Button>

              <div className="flex gap-2 mb-4">
                <Input
                  type="time"
                  value={blockTimeInput}
                  onChange={(e) => setBlockTimeInput(e.target.value)}
                  className="text-right"
                />
                <Button variant="outline" size="sm" onClick={handleBlockTime} disabled={!blockTimeInput}>
                  חסום
                </Button>
              </div>

              {/* Blocked slots list */}
              {blockedSlots.length > 0 && (
                <div className="space-y-2">
                  {blockedSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between bg-secondary rounded-lg p-2 text-sm"
                    >
                      <span>{slot.time ? `שעה: ${slot.time}` : "יום שלם"}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleUnblock(slot.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Slot Duration */}
            <div className="card-premium p-5">
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">משך תור</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDurationChange(settings.slotDuration - 5)}
                >
                  -
                </Button>
                <span className="text-lg font-bold text-foreground min-w-[60px] text-center">
                  {settings.slotDuration} דק׳
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDurationChange(settings.slotDuration + 5)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deletingAppointment && (
        <DeleteConfirmation
          appointment={deletingAppointment}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingAppointment(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

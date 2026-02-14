import { useState } from "react";
import { Scissors, Search, CalendarPlus } from "lucide-react";
import Layout from "@/components/Layout";
import BookingForm from "@/components/booking/BookingForm";
import FindAppointment from "@/components/booking/FindAppointment";

type Tab = "book" | "find";

const Index = () => {
  const [tab, setTab] = useState<Tab>("book");

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/15 mb-4">
            <Scissors className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            ברוכים הבאים
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            קבעו תור בקלות ובמהירות — חוויית טיפוח פרימיום
          </p>
          <div className="section-divider mt-4" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setTab("book")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === "book"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <CalendarPlus className="w-4 h-4" />
            הזמנת תור
          </button>
          <button
            onClick={() => setTab("find")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === "find"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Search className="w-4 h-4" />
            מצא תור
          </button>
        </div>

        {/* Content */}
        {tab === "book" ? <BookingForm /> : <FindAppointment />}
      </div>
    </Layout>
  );
};

export default Index;

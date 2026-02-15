import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scissors, Calendar, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-md z-50 shadow-sm shrink-0">
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground leading-tight tracking-wide">
                Prime Cuts
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-[0.25em] uppercase font-light">
                Classic Barbershop
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isAdmin
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">הזמן תור</span>
            </Link>
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAdmin
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">ניהול</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content - scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-5 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-3 shrink-0">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Prime Cuts — Classic Barbershop
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

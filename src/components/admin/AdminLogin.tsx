import { useState } from "react";
import { Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_PASSWORD = "1234";
const SESSION_KEY = "barber_admin_auth";

export const isAdminAuthenticated = () => {
  return sessionStorage.getItem(SESSION_KEY) === "true" || localStorage.getItem(SESSION_KEY) === "true";
};

export const logoutAdmin = () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
};

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin = ({ onSuccess }: AdminLoginProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, "true");
      } else {
        sessionStorage.setItem(SESSION_KEY, "true");
      }
      onSuccess();
    } else {
      setError("סיסמה שגויה, נסה שוב");
      setPassword("");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-fade-in" dir="rtl">
      <div className="card-premium p-8 md:p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">כניסת מנהל</h2>
          <div className="section-divider mb-3" />
          <p className="text-sm text-muted-foreground">הזן סיסמה כדי לגשת ללוח הבקרה</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">סיסמה</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="הזן סיסמה"
                className="pr-10 pl-10 text-right"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-destructive text-xs mt-2">{error}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-border"
            />
            זכור אותי
          </label>

          <Button variant="gold" size="lg" className="w-full" onClick={handleLogin} disabled={!password}>
            <LogIn className="w-4 h-4 ml-2" />
            כניסה
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

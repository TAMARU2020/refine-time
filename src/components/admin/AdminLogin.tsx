import { useState } from "react";
import { Lock, Eye, EyeOff, LogIn, KeyRound, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PASSWORD_KEY = "barber_admin_password";
const SESSION_KEY = "barber_admin_auth";

export const getStoredPassword = () => localStorage.getItem(PASSWORD_KEY);
export const isPasswordSet = () => !!getStoredPassword();

export const isAdminAuthenticated = () => {
  return sessionStorage.getItem(SESSION_KEY) === "true" || localStorage.getItem(SESSION_KEY) === "true";
};

export const logoutAdmin = () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
};

export const resetAdminPassword = () => {
  localStorage.removeItem(PASSWORD_KEY);
  logoutAdmin();
};

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin = ({ onSuccess }: AdminLoginProps) => {
  const hasPassword = isPasswordSet();
  const [mode, setMode] = useState<"login" | "setup" | "reset">(hasPassword ? "login" : "setup");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");

  const handleLogin = () => {
    if (password === getStoredPassword()) {
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

  const handleSetup = () => {
    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }
    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }
    localStorage.setItem(PASSWORD_KEY, password);
    sessionStorage.setItem(SESSION_KEY, "true");
    onSuccess();
  };

  const handleReset = () => {
    if (resetConfirmText !== "RESET") return;
    resetAdminPassword();
    setPassword("");
    setConfirmPassword("");
    setResetConfirmText("");
    setError("");
    setMode("setup");
  };

  if (mode === "reset") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in" dir="rtl">
        <div className="card-premium p-8 md:p-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">איפוס סיסמה</h2>
            <div className="section-divider mb-3" />
            <p className="text-sm text-muted-foreground">פעולה זו תמחק את הסיסמה השמורה</p>
          </div>

          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-foreground font-medium mb-1">⚠️ שים לב</p>
            <p className="text-xs text-muted-foreground">
              איפוס הסיסמה ימחק את הסיסמה הנוכחית. תצטרך להגדיר סיסמה חדשה. נתוני התורים לא יימחקו.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                הקלד <span className="font-bold text-destructive font-mono">RESET</span> לאישור
              </label>
              <Input
                value={resetConfirmText}
                onChange={(e) => setResetConfirmText(e.target.value)}
                placeholder="הקלד RESET כאן"
                className="text-center font-mono tracking-widest"
                dir="ltr"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setMode("login"); setResetConfirmText(""); }}>
                ביטול
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleReset} disabled={resetConfirmText !== "RESET"}>
                אפס סיסמה
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-fade-in" dir="rtl">
      <div className="card-premium p-8 md:p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            {mode === "setup" ? (
              <ShieldCheck className="w-7 h-7 text-primary" />
            ) : (
              <Lock className="w-7 h-7 text-primary" />
            )}
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            {mode === "setup" ? "הגדרת סיסמה" : "כניסת מנהל"}
          </h2>
          <div className="section-divider mb-3" />
          <p className="text-sm text-muted-foreground">
            {mode === "setup" ? "הגדר סיסמה לגישה ללוח הבקרה" : "הזן סיסמה כדי לגשת ללוח הבקרה"}
          </p>
        </div>

        <div className="space-y-5">
          {/* Password */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">סיסמה</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder={mode === "setup" ? "לפחות 6 תווים" : "הזן סיסמה"}
                className="pr-10 pl-10 text-right"
                onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? handleLogin() : null)}
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
          </div>

          {/* Confirm password (setup mode) */}
          {mode === "setup" && (
            <div className="animate-fade-in">
              <label className="text-sm font-medium text-foreground mb-1.5 block">אימות סיסמה</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  placeholder="הזן שוב את הסיסמה"
                  className="pr-10 text-right"
                  onKeyDown={(e) => e.key === "Enter" && handleSetup()}
                />
                <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )}

          {error && <p className="text-destructive text-xs">{error}</p>}

          {mode === "login" && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border"
              />
              זכור אותי
            </label>
          )}

          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={mode === "setup" ? handleSetup : handleLogin}
            disabled={mode === "setup" ? (!password || !confirmPassword) : !password}
          >
            <LogIn className="w-4 h-4 ml-2" />
            {mode === "setup" ? "שמור סיסמה והיכנס" : "כניסה"}
          </Button>

          {mode === "login" && (
            <button
              onClick={() => setMode("reset")}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              שכחת סיסמה? איפוס
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

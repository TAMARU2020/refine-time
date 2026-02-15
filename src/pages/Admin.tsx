import { useState } from "react";
import { LogOut } from "lucide-react";
import Layout from "@/components/Layout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin, { isAdminAuthenticated, logoutAdmin } from "@/components/admin/AdminLogin";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated());

  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <Layout>
        <AdminLogin onSuccess={() => setAuthenticated(true)} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-end mb-4" dir="rtl">
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
          <LogOut className="w-4 h-4 ml-2" />
          התנתק
        </Button>
      </div>
      <AdminDashboard />
    </Layout>
  );
};

export default Admin;

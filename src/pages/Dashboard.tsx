import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { LinksManagement } from "@/components/dashboard/LinksManagement";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, sessionToken, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-primary">Loading...</div>
      </div>
    );
  }

  if (!user || !sessionToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <ProfileSettings user={user} sessionToken={sessionToken} />
            <LinksManagement sessionToken={sessionToken} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AnalyticsCard sessionToken={sessionToken} />
            <QuickActions user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
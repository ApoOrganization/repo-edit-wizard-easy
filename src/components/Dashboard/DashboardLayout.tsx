
import { useNavigate, useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
}

const DashboardLayout = ({ children, showBackButton = false, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.startsWith("/events")) return "Events";
    if (path.startsWith("/artists")) return "Artists";
    if (path.startsWith("/venues")) return "Venues";
    if (path.startsWith("/promoters")) return "Promoters";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-1">
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 w-full max-w-none md:px-8 lg:px-12 flex-1">
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

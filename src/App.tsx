
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Artists from "./pages/Artists";
import Venues from "./pages/Venues";
import VenueDetail from "./pages/VenueDetail";
import Promoters from "./pages/Promoters";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">
              <div className="h-12 flex items-center border-b border-gray-200 bg-white px-4">
                <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
              </div>
              <Routes>
                <Route path="/" element={<DashboardLayout><Index /></DashboardLayout>} />
                <Route path="/events" element={<DashboardLayout><Events /></DashboardLayout>} />
                <Route path="/events/:id" element={<DashboardLayout><EventDetail /></DashboardLayout>} />
                <Route path="/artists" element={<DashboardLayout><Artists /></DashboardLayout>} />
                <Route path="/venues" element={<DashboardLayout><Venues /></DashboardLayout>} />
                <Route path="/venues/:id" element={<DashboardLayout><VenueDetail /></DashboardLayout>} />
                <Route path="/promoters" element={<DashboardLayout><Promoters /></DashboardLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

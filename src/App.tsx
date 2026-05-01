import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";

import Index from "./pages/Index";           // Points Page
import Login from "./pages/Login";           // Admin Login Page
import ManageAdmins from "./pages/ManageAdmins"; // Main Admin Page
import NotFound from "./pages/NotFound";
import LeaderboardPage from "./pages/LeaderBoard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Public Leaderboard */}
            <Route path="/leaderboard" element={<LeaderboardPage />} />

            {/* Points (default admin home) */}
            <Route path="/points" element={<Index />} />

            {/* Main Admin page */}
            <Route path="/manage-admins" element={<ManageAdmins />} />

            {/* Redirect root "/" → login */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

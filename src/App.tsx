import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { VerifyOTPPage } from "./pages/Authentication/VerifyEmail";
import { SignupPage } from "./pages/Authentication/SignUp";
import { LoginPage } from "./pages/Authentication/Login";
import Dashboard from "./pages/Dashboard/Dashboard"
import Employees from "./pages/Dashboard/Employees"
import Reports from "./pages/Dashboard/Reports"
import Settings from "./pages/Dashboard/Settings"
import Payroll from "./pages/Dashboard/Payroll"

import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./pages/Dashboard/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyOTPPage />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route 
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/payroll" 
            element={
              <ProtectedRoute>
                <Payroll />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
              } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

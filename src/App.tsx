import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF',
          border: '1px solid #2C2C2C',
          borderRadius: '8px',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
        toastClassName="custom-toast"
        className="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
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

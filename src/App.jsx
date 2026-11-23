import React, { useState } from 'react';
import { LoginPage } from './features/auth';
import { DashboardPage } from './features/dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('adminware_token');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {isAuthenticated ? (
        <DashboardPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLogin} />
      )}
    </div>
  );
} 
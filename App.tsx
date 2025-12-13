import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import AuthPage from './modules/auth/pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ArchitectureGenerator from './pages/ArchitectureGenerator';
import SafetyMonitor from './pages/SafetyMonitor';
import ResourceManagement from './pages/ResourceManagement';
import WorkspaceManagement from './pages/WorkspaceManagement';
import Reports from './pages/Reports';
import PitchDeck from './pages/PitchDeck';
import { AppProvider, useApp } from './context/AppContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Guard component to protect routes
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected Routes Wrapper */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/workspaces" element={<WorkspaceManagement />} />
                  <Route path="/generator" element={<ArchitectureGenerator />} />
                  <Route path="/safety" element={<SafetyMonitor />} />
                  <Route path="/resources" element={<ResourceManagement />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/pitch" element={<PitchDeck />} />
                </Routes>
              </Layout>
            </RequireAuth>
          }
        />
      </Routes>
  );
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <AppRoutes />
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
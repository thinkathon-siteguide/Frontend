import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ArchitectureGenerator from './pages/ArchitectureGenerator';
import SafetyMonitor from './pages/SafetyMonitor';
import ResourceManagement from './pages/ResourceManagement';
import WorkspaceManagement from './pages/WorkspaceManagement';
import Reports from './pages/Reports';
import PitchDeck from './pages/PitchDeck';
import { AppProvider, useApp } from './context/AppContext';

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
        <Route path="/auth" element={<Auth />} />
        
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
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
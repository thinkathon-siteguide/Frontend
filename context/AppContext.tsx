import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Workspace, ResourceItem, GeneratedArchitecture, SafetyReport } from '../types';

interface User {
  name: string;
  email: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  activeWorkspace: Workspace | undefined;
  addWorkspace: (workspace: Omit<Workspace, 'id' | 'lastUpdated' | 'progress' | 'safetyScore' | 'resources' | 'safetyReports' | 'status'>) => void;
  updateWorkspaceDetails: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  toggleWorkspaceStatus: (id: string) => void;
  updateWorkspaceProgress: (id: string, progress: number) => void;
  setActiveWorkspace: (id: string | null) => void;
  updateResourceQuantity: (workspaceId: string, resourceId: string, newQuantity: number) => void;
  setWorkspaceResources: (workspaceId: string, resources: ResourceItem[]) => void;
  addResourceToWorkspace: (workspaceId: string, resource: Omit<ResourceItem, 'id'>) => void;
  deleteResourceFromWorkspace: (workspaceId: string, resourceId: string) => void;
  saveArchitectureToWorkspace: (workspaceId: string, plan: GeneratedArchitecture) => void;
  saveSafetyReportToWorkspace: (workspaceId: string, report: SafetyReport) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultResources: ResourceItem[] = [
  { id: '1', name: 'Cement', quantity: 0, unit: 'Bags', threshold: 100, status: 'Low' },
  { id: '2', name: 'Sand', quantity: 0, unit: 'Tons', threshold: 50, status: 'Low' },
  { id: '3', name: 'Granite', quantity: 0, unit: 'Tons', threshold: 30, status: 'Low' },
  { id: '4', name: 'Iron Rods', quantity: 0, unit: 'Pieces', threshold: 250, status: 'Low' },
  { id: '5', name: 'Blocks', quantity: 0, unit: 'Units', threshold: 1000, status: 'Low' },
];

const initialWorkspaces: Workspace[] = [];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

  // Check for persisted user on load
  useEffect(() => {
    const storedUser = localStorage.getItem('thinklab_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedWorkspaces = localStorage.getItem('thinklab_workspaces');
    if (storedWorkspaces) {
      setWorkspaces(JSON.parse(storedWorkspaces));
    }
  }, []);

  // Persist workspaces whenever they change
  useEffect(() => {
    if (workspaces.length > 0) {
      localStorage.setItem('thinklab_workspaces', JSON.stringify(workspaces));
    }
  }, [workspaces]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  // --- Auth Simulation ---
  const login = async (email: string, pass: string): Promise<boolean> => {
    // In a real app, this calls the backend API
    const storedAccounts = JSON.parse(localStorage.getItem('thinklab_accounts') || '[]');
    const account = storedAccounts.find((acc: any) => acc.email === email && acc.password === pass);
    
    if (account) {
        const userData = { name: account.name, email: account.email };
        setUser(userData);
        localStorage.setItem('thinklab_user', JSON.stringify(userData));
        return true;
    }
    return false;
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    const storedAccounts = JSON.parse(localStorage.getItem('thinklab_accounts') || '[]');
    if (storedAccounts.find((acc: any) => acc.email === email)) {
        return false; // User exists
    }
    
    const newAccount = { name, email, password: pass };
    storedAccounts.push(newAccount);
    localStorage.setItem('thinklab_accounts', JSON.stringify(storedAccounts));
    
    const userData = { name, email };
    setUser(userData);
    localStorage.setItem('thinklab_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('thinklab_user');
    // We do not clear workspaces on logout for this demo so data persists
  };
  // -----------------------

  const addWorkspace = (newWs: Omit<Workspace, 'id' | 'lastUpdated' | 'progress' | 'safetyScore' | 'resources' | 'safetyReports' | 'status'>) => {
    const workspace: Workspace = {
      ...newWs,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: 'Just now',
      progress: 0,
      safetyScore: 100,
      status: 'Under Construction',
      resources: JSON.parse(JSON.stringify(defaultResources)), 
      safetyReports: []
    };
    setWorkspaces([workspace, ...workspaces]);
  };

  const updateWorkspaceDetails = (id: string, updates: Partial<Workspace>) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, ...updates, lastUpdated: 'Just now' };
      }
      return w;
    }));
  };

  const deleteWorkspace = (id: string) => {
    setWorkspaces(prev => prev.filter(w => w.id !== id));
    if (activeWorkspaceId === id) {
      setActiveWorkspaceId(null);
    }
  };

  const toggleWorkspaceStatus = (id: string) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === id) {
        return { 
          ...w, 
          status: w.status === 'Under Construction' ? 'Finished' : 'Under Construction',
          progress: w.status === 'Under Construction' ? 100 : w.progress 
        };
      }
      return w;
    }));
  };

  const updateWorkspaceProgress = (id: string, progress: number) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, progress, lastUpdated: 'Just now' };
      }
      return w;
    }));
  };

  const setActiveWorkspace = (id: string | null) => {
    setActiveWorkspaceId(id);
  };

  const updateResourceQuantity = (workspaceId: string, resourceId: string, newQuantity: number) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        const updatedResources = ws.resources.map(r => {
          if (r.id === resourceId) {
            let status: 'Good' | 'Low' | 'Critical' = 'Good';
            if (newQuantity <= r.threshold * 0.5) status = 'Critical';
            else if (newQuantity <= r.threshold) status = 'Low';
            return { ...r, quantity: newQuantity, status };
          }
          return r;
        });
        return { ...ws, resources: updatedResources, lastUpdated: 'Just now' };
      }
      return ws;
    }));
  };

  const setWorkspaceResources = (workspaceId: string, resources: ResourceItem[]) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return { ...ws, resources, lastUpdated: 'Just now' };
      }
      return ws;
    }));
  };

  const addResourceToWorkspace = (workspaceId: string, resource: Omit<ResourceItem, 'id'>) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        const newResource: ResourceItem = {
           ...resource,
           id: Math.random().toString(36).substr(2, 9)
        };
        return { ...ws, resources: [...ws.resources, newResource], lastUpdated: 'Just now' };
      }
      return ws;
    }));
  };

  const deleteResourceFromWorkspace = (workspaceId: string, resourceId: string) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return { ...ws, resources: ws.resources.filter(r => r.id !== resourceId), lastUpdated: 'Just now' };
      }
      return ws;
    }));
  };

  const saveArchitectureToWorkspace = (workspaceId: string, plan: GeneratedArchitecture) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return { ...ws, architecturePlan: plan, lastUpdated: 'Just now' };
      }
      return ws;
    }));
  };

  const saveSafetyReportToWorkspace = (workspaceId: string, report: SafetyReport) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        const newReports = [
          { ...report, id: Math.random().toString(36).substr(2, 9), date: new Date().toLocaleDateString() },
          ...(ws.safetyReports || [])
        ];
        const newSafetyScore = Math.max(0, 100 - report.riskScore);
        return { ...ws, safetyReports: newReports, safetyScore: newSafetyScore, lastUpdated: 'Just now' };
      }
      return ws;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      user,
      login,
      register,
      logout,
      workspaces, 
      activeWorkspaceId, 
      activeWorkspace, 
      addWorkspace, 
      updateWorkspaceDetails,
      deleteWorkspace,
      toggleWorkspaceStatus,
      updateWorkspaceProgress,
      setActiveWorkspace,
      updateResourceQuantity,
      setWorkspaceResources,
      addResourceToWorkspace,
      deleteResourceFromWorkspace,
      saveArchitectureToWorkspace,
      saveSafetyReportToWorkspace
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
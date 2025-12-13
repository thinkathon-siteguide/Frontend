import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  _id?: string;
  name: string;
  email: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  activeWorkspaceId: string | null;
  setActiveWorkspace: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('thinklab_user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('thinklab_user');
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    setActiveWorkspaceId(null);
    localStorage.removeItem('thinklab_user');
    localStorage.removeItem('token');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logout,
        activeWorkspaceId,
        setActiveWorkspace: setActiveWorkspaceId,
      }}
    >
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

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HardHat, 
  Briefcase, 
  FileText, 
  Menu, 
  LogOut,
  Building2,
  Hammer,
  ChevronRight,
  ShieldCheck,
  Presentation
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { activeWorkspace, user, logout } = useApp();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Workspaces', path: '/workspaces', icon: Briefcase },
    { name: 'Architecture AI', path: '/generator', icon: Building2 },
    { name: 'Inventory', path: '/resources', icon: Hammer },
    { name: 'Safety Monitor', path: '/safety', icon: HardHat },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Pitch Deck', path: '/pitch', icon: Presentation },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-thinklab-black text-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Brand Area */}
          <div className="h-24 flex flex-col items-center justify-center border-b border-gray-800 bg-black/20">
             <div className="flex items-center gap-2">
                <Logo className="w-8 h-8" />
                <div>
                   <h1 className="text-xl font-serif font-bold tracking-wide text-white">ThinkLab</h1>
                </div>
             </div>
             <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1 font-medium">SiteGuard Solution</span>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-6 space-y-2 overflow-y-auto">
             <div className="px-6 mb-2 text-xs text-gray-500 uppercase tracking-widest font-bold">Main Menu</div>
             {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-6 py-3 transition-colors border-l-4 ${
                    isActive
                    ? 'bg-gray-800 text-white border-thinklab-red' 
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white border-transparent'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-thinklab-red' : ''}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
             )})}
          </div>

          {/* User Status */}
          <div className="p-4 border-t border-gray-800 bg-black/20">
             <button 
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
             >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
             </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-30 border-b border-gray-200">
          <div className="flex items-center">
              <button onClick={toggleSidebar} className="md:hidden text-thinklab-black mr-4">
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Breadcrumb */}
              <div className="hidden md:flex items-center text-sm">
                 <span className="text-gray-500 font-medium">Platform</span>
                 <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                 {activeWorkspace ? (
                   <>
                     <span className="text-gray-500 font-medium">Workspaces</span>
                     <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                     <span className="font-bold text-thinklab-red bg-red-50 px-3 py-1 rounded-full text-xs border border-red-100">
                        {activeWorkspace.name}
                     </span>
                   </>
                 ) : (
                   <span className="font-bold text-thinklab-black">Portfolio Overview</span>
                 )}
              </div>
          </div>
          
          <div className="flex items-center ml-auto space-x-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-thinklab-black">{user?.name || 'Engineer'}</p>
                <div className="flex items-center justify-end gap-1">
                   <ShieldCheck className="w-3 h-3 text-green-600" />
                   <p className="text-xs text-gray-500">Authenticated</p>
                </div>
             </div>
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 text-thinklab-black font-serif font-bold">
                {user?.name ? user.name.substring(0,2).toUpperCase() : 'TL'}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto w-full h-full">
              {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
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
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-thinklab-black text-white shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:translate-x-0 md:static md:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Subtle Background Gradient/Texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>

        <div className="relative flex flex-col h-full z-10">
          {/* Brand Area */}
          <div className="h-28 flex flex-col items-center justify-center border-b border-white/5 bg-white/5 backdrop-blur-sm relative overflow-hidden group">
             {/* Glow Effect */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-thinklab-red/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             
             <div className="relative z-10 flex items-center gap-3 transform group-hover:scale-105 transition-transform duration-300">
                <div className="p-2 bg-white/10 rounded-lg border border-white/10 shadow-lg">
                    <Logo className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                   <h1 className="text-2xl font-serif font-bold tracking-tight text-white leading-none">ThinkLab</h1>
                   <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-thinklab-red animate-pulse"></div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">SiteGuard</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
             <div className="px-4 mb-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                <span className="w-8 h-[1px] bg-gray-700"></span>
                Main Menu
             </div>
             {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group animate-slide-in-right ${
                    isActive
                    ? 'bg-gradient-to-r from-thinklab-red to-red-900 text-white shadow-lg translate-x-1' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-thinklab-red'
                  }`} />
                  <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>{item.name}</span>
                  
                  {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-white/50" />
                  )}
                </Link>
             )})}
          </div>

          {/* User Status */}
          <div className="p-4 border-t border-white/5 bg-black/40">
             <button 
                onClick={logout}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 group"
             >
                <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                Sign Out
             </button>
             <div className="mt-4 text-center">
                <p className="text-[10px] text-gray-600">v1.2.0 • ThinkLab Inc.</p>
             </div>
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
import React from 'react';
import { 
  ArrowUpRight, 
  AlertTriangle, 
  Package, 
  Activity, 
  Plus, 
  FileText, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Building, 
  CheckCircle2,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useWorkspaces } from '../modules/workspace';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const Dashboard: React.FC = () => {
  const { activeWorkspaceId, setActiveWorkspace, user } = useApp();
  const { workspaces = [], isLoading } = useWorkspaces();
  const navigate = useNavigate();

  const activeWorkspace = workspaces.find(w => w._id === activeWorkspaceId);
  const displayWorkspaces = activeWorkspace ? [activeWorkspace] : workspaces;
  const totalWorkspaces = workspaces.length;
  const safetyAlerts = workspaces.filter(w => w.safetyScore < 75).length;
  const avgProgress = workspaces.length > 0 ? Math.round(workspaces.reduce((acc, curr) => acc + curr.progress, 0) / workspaces.length) : 0;

  // Chart Data preparation
  const progressData = workspaces.map(w => ({
    name: w.name.split(' ')[0], // Short name
    progress: w.progress,
    safety: w.safetyScore
  }));

  const safetyData = [
    { name: 'Safe', value: workspaces.filter(w => w.safetyScore >= 90).length, color: '#10B981' },
    { name: 'Warning', value: workspaces.filter(w => w.safetyScore >= 75 && w.safetyScore < 90).length, color: '#F59E0B' },
    { name: 'Critical', value: workspaces.filter(w => w.safetyScore < 75).length, color: '#D0021B' },
  ].filter(d => d.value > 0);

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue", delay = 0 }: any) => {
    const colorStyles = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
        green: { bg: 'bg-green-50', text: 'text-green-600' },
        red: { bg: 'bg-red-50', text: 'text-thinklab-red' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    };
    const style = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue;

    return (
    <div 
        className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-serif font-bold text-thinklab-black mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${style.bg} ${style.text}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        {trend && (
            <div className="flex items-center text-xs font-medium">
                <span className={`flex items-center ${trend.isPositive ? 'text-green-600' : 'text-thinklab-red'}`}>
                    {trend.isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <AlertTriangle size={14} className="mr-1" />}
                    {trend.text}
                </span>
            </div>
        )}
    </div>
  );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-thinklab-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade-in-up">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
           <Building className="w-12 h-12 text-gray-400" />
        </div>
        <div className="max-w-md">
          <h2 className="text-3xl font-serif font-bold text-thinklab-black mb-3">Welcome to ThinkLab</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Your workspace is empty. Create your first project to start generating architectural plans and monitoring safety.
          </p>
        </div>
        <button 
          onClick={() => navigate('/workspaces')}
          className="bg-thinklab-red text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          Create New Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-gray-200 pb-6 animate-fade-in">
        <div>
          <h2 className="text-4xl font-serif font-bold text-thinklab-black tracking-tight">
            {activeWorkspace ? activeWorkspace.name : `Hello, ${user?.name?.split(' ')[0] || 'Engineer'}`}
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            {activeWorkspace 
                ? <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${activeWorkspace.status === 'Finished' ? 'bg-green-500' : 'bg-blue-500'}`}></div> {activeWorkspace.location} • {activeWorkspace.status}</span> 
                : 'Here is an overview of your active construction sites.'}
          </p>
        </div>
        {activeWorkspace && (
          <button 
            onClick={() => setActiveWorkspace(null)}
            className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-thinklab-black font-semibold rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title={activeWorkspace ? "Project Progress" : "Total Workspaces"}
            value={activeWorkspace ? `${activeWorkspace.progress}%` : totalWorkspaces}
            icon={Activity}
            color="blue"
            delay={100}
            trend={!activeWorkspace ? { isPositive: true, text: `${avgProgress}% Avg. Completion` } : undefined}
        />
        <StatCard 
            title="Safety Score"
            value={activeWorkspace ? `${activeWorkspace.safetyScore}%` : (workspaces.length - safetyAlerts)}
            icon={AlertTriangle}
            color={safetyAlerts > 0 || (activeWorkspace?.safetyScore || 100) < 75 ? "red" : "green"}
            delay={200}
            trend={{ 
                isPositive: (activeWorkspace?.safetyScore || 100) >= 90, 
                text: (activeWorkspace?.safetyScore || 100) >= 90 ? "Site is Secure" : "Attention Needed" 
            }}
        />
        <StatCard 
            title="Inventory Items"
            value={activeWorkspace ? activeWorkspace.resources.reduce((acc, r) => acc + r.quantity, 0) : workspaces.reduce((acc, w) => acc + w.resources.reduce((rAcc, r) => rAcc + r.quantity, 0), 0)}
            icon={Package}
            color="purple"
            delay={300}
            trend={{ isPositive: true, text: "Stock Levels" }}
        />
        
        {/* Quick Action / Chart Card */}
        <div 
            className="bg-gradient-to-br from-thinklab-black to-gray-900 p-6 rounded-2xl shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up text-white flex flex-col justify-between group cursor-pointer"
            style={{ animationDelay: '400ms' }}
            onClick={() => navigate('/workspaces')}
        >
            <div>
               <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-thinklab-red transition-colors">
                   <Plus className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-xl font-bold font-serif mb-1">New Project</h3>
               <p className="text-gray-400 text-sm">Start a new workspace</p>
            </div>
            <div className="flex justify-end">
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
            </div>
        </div>
      </div>

      {/* Charts Section - showed only on Overview */}
      {!activeWorkspace && workspaces.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                  <h3 className="text-lg font-serif font-bold text-thinklab-black mb-6">Workspace Progress</h3>
                  <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={progressData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                              <Tooltip 
                                cursor={{fill: '#F9FAFB'}}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                              />
                              <Bar dataKey="progress" fill="#111827" radius={[4, 4, 0, 0]} barSize={40}>
                                {progressData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.progress === 100 ? '#10B981' : '#111827'} />
                                ))}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                  <h3 className="text-lg font-serif font-bold text-thinklab-black mb-6">Safety Overview</h3>
                  <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                                data={safetyData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {safetyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-bold text-thinklab-black">{workspaces.length}</span>
                          <span className="text-xs text-gray-500 uppercase tracking-widest">Sites</span>
                      </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                      {safetyData.map((item, index) => (
                          <div key={index} className="flex items-center text-xs font-medium text-gray-600">
                              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                              {item.name} ({item.value})
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Blueprint Visual for Active Workspace */}
      {activeWorkspace && activeWorkspace.architecturePlan && (
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
           <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-serif font-bold text-thinklab-black flex items-center">
                 <FileText className="w-5 h-5 mr-3 text-thinklab-red"/> 
                 Architecture Plan
              </h3>
              <button 
                onClick={() => navigate('/generator')}
                className="text-xs font-bold text-thinklab-red hover:underline flex items-center bg-red-50 px-3 py-1.5 rounded-full"
              >
                 View Full Blueprint <ArrowRight className="w-3 h-3 ml-1" />
              </button>
           </div>
           <div className="p-8">
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100 mb-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-thinklab-red/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                 <p className="text-gray-700 text-lg italic leading-relaxed relative z-10">"{activeWorkspace.architecturePlan.summary}"</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</p>
                        <p className="font-serif font-bold text-xl text-thinklab-black">₦{activeWorkspace.budget}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Materials</p>
                        <p className="font-serif font-bold text-xl text-thinklab-black">{activeWorkspace.architecturePlan.materials.length} Items</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Phase</p>
                        <p className="font-serif font-bold text-xl text-thinklab-black truncate">{activeWorkspace.stage}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-serif font-bold text-thinklab-black">
            {activeWorkspace ? 'Project Details' : 'Active Projects'}
          </h3>
          {!activeWorkspace && (
              <button 
                onClick={() => navigate('/workspaces')} 
                className="text-sm text-thinklab-red font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                  View All Projects
              </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayWorkspaces.map((ws, index) => (
                <tr 
                    key={ws._id} 
                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                    onClick={() => setActiveWorkspace(ws._id)}
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-thinklab-black text-white flex items-center justify-center font-bold mr-3 font-serif">
                            {ws.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-thinklab-black group-hover:text-thinklab-red transition-colors">{ws.name}</p>
                            <p className="text-xs text-gray-400 flex items-center mt-0.5">
                                <Calendar size={10} className="mr-1" /> {new Date(ws.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-600 font-medium text-sm">{ws.location}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 border border-gray-200">
                      {ws.stage}
                    </span>
                  </td>
                  <td className="px-6 py-5 w-48">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-100 rounded-full h-2 mr-3 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${ws.progress === 100 ? 'bg-green-500' : 'bg-thinklab-black'}`} 
                            style={{ width: `${ws.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600 min-w-[30px]">{ws.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-2">
                         <CheckCircle2 size={16} className={ws.status === 'Finished' ? 'text-green-500' : 'text-blue-500'} />
                         <span className={`text-sm font-medium ${ws.status === 'Finished' ? 'text-green-700' : 'text-blue-700'}`}>
                           {ws.status}
                         </span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-gray-400 hover:text-thinklab-black transition-colors rounded-full p-2 hover:bg-gray-100">
                        <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
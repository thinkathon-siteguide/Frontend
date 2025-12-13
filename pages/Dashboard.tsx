import React from 'react';
import { ArrowUpRight, AlertTriangle, Package, Activity, Plus, FileText, Clock, DollarSign, ArrowRight, Building } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { workspaces, activeWorkspace, setActiveWorkspace } = useApp();
  const navigate = useNavigate();

  const displayWorkspaces = activeWorkspace ? [activeWorkspace] : workspaces;
  const totalWorkspaces = workspaces.length;
  const safetyAlerts = workspaces.filter(w => w.safetyScore < 75).length;
  const avgProgress = workspaces.length > 0 ? Math.round(workspaces.reduce((acc, curr) => acc + curr.progress, 0) / workspaces.length) : 0;

  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
           <Building className="w-10 h-10 text-gray-400" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-thinklab-black">Welcome to ThinkLab</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            You don't have any active construction sites. Create a workspace to start managing your projects.
          </p>
        </div>
        <button 
          onClick={() => navigate('/workspaces')}
          className="bg-thinklab-red text-white px-6 py-3 rounded-lg font-medium shadow-soft hover:shadow-lg transition flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-thinklab-black">
            {activeWorkspace ? activeWorkspace.name : 'Dashboard'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {activeWorkspace ? `Location: ${activeWorkspace.location} • Status: ${activeWorkspace.status}` : 'Overview of all construction activities'}
          </p>
        </div>
        {activeWorkspace && (
          <button 
            onClick={() => setActiveWorkspace(null)}
            className="text-sm text-thinklab-red font-bold hover:underline flex items-center"
          >
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
            Back to Overview
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Progress Module */}
        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                {activeWorkspace ? 'Project Progress' : 'Total Projects'}
              </p>
              <h3 className="text-3xl font-serif font-bold text-thinklab-black mt-2">
                {activeWorkspace ? `${activeWorkspace.progress}%` : totalWorkspaces}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          {!activeWorkspace && (
             <div className="flex items-center text-xs text-green-600 font-medium">
               <ArrowUpRight size={14} className="mr-1" />
               <span>{avgProgress}% Average Completion</span>
             </div>
          )}
          {activeWorkspace && (
             <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                <div className="h-full bg-blue-600 rounded-full" style={{width: `${activeWorkspace.progress}%`}}></div>
             </div>
          )}
        </div>

        {/* Safety Module */}
        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
           <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Safety Score</p>
              <h3 className={`text-3xl font-serif font-bold mt-2 ${safetyAlerts > 0 ? 'text-thinklab-red' : 'text-green-600'}`}>
                {activeWorkspace ? `${activeWorkspace.safetyScore}%` : (workspaces.length - safetyAlerts)}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${safetyAlerts > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <AlertTriangle size={24} className={safetyAlerts > 0 ? 'text-thinklab-red' : 'text-green-600'} />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {activeWorkspace 
              ? (activeWorkspace.safetyScore < 90 ? 'Attention Required' : 'Site condition is good') 
              : `${safetyAlerts} sites require attention`}
          </p>
        </div>

        {/* Resource Module */}
        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
           <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Inventory Items</p>
              <h3 className="text-3xl font-serif font-bold text-thinklab-black mt-2">
                 {activeWorkspace ? activeWorkspace.resources.reduce((acc, r) => acc + r.quantity, 0) : 'N/A'}
              </h3>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
                <Package size={24} className="text-thinklab-black" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Total tracked units</p>
        </div>

        {/* Create Button */}
        <button 
          onClick={() => navigate('/workspaces')}
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:bg-white hover:border-thinklab-red hover:text-thinklab-red transition group"
        >
           <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
               <Plus size={24} className="text-thinklab-red" />
           </div>
           <span className="font-bold text-sm text-gray-600 group-hover:text-thinklab-red">New Workspace</span>
        </button>
      </div>

      {/* Blueprint Viz (Active Only) */}
      {activeWorkspace && activeWorkspace.architecturePlan && (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-thinklab-black flex items-center">
                 <FileText className="w-5 h-5 mr-2 text-thinklab-red"/> 
                 Architecture Plan
              </h3>
              <button 
                onClick={() => navigate('/generator')}
                className="text-xs font-bold text-thinklab-red hover:underline flex items-center"
              >
                 View Full Details <ArrowRight className="w-3 h-3 ml-1" />
              </button>
           </div>
           <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-thinklab-black mb-6">
                 <p className="text-gray-700 text-sm italic">"{activeWorkspace.architecturePlan.summary}"</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <div className="flex items-center text-gray-400 text-xs uppercase font-bold mb-1">
                       <DollarSign className="w-4 h-4 mr-1" /> Est. Budget
                    </div>
                    <p className="font-serif font-bold text-lg text-thinklab-black">{activeWorkspace.architecturePlan.costEstimate}</p>
                 </div>
                 <div>
                    <div className="flex items-center text-gray-400 text-xs uppercase font-bold mb-1">
                       <Clock className="w-4 h-4 mr-1" /> Duration
                    </div>
                    <p className="font-serif font-bold text-lg text-thinklab-black">{activeWorkspace.architecturePlan.timeline}</p>
                 </div>
                 <div>
                    <div className="flex items-center text-gray-400 text-xs uppercase font-bold mb-1">
                       <Activity className="w-4 h-4 mr-1" /> Current Phase
                    </div>
                    <p className="font-serif font-bold text-lg text-thinklab-black truncate">{activeWorkspace.stage}</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-serif font-bold text-thinklab-black">
            {activeWorkspace ? 'Project Details' : 'Active Projects'}
          </h3>
          {!activeWorkspace && <button onClick={() => navigate('/workspaces')} className="text-sm text-thinklab-red font-bold hover:underline">View All</button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {displayWorkspaces.map((ws) => (
                <tr key={ws.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-thinklab-black">{ws.name}</p>
                    <p className="text-xs text-gray-400">Updated: {ws.lastUpdated}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ws.location}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      {ws.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 w-48">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                        <div className={`h-full rounded-full ${ws.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${ws.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600">{ws.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                       ws.status === 'Finished' 
                       ? 'bg-green-100 text-green-700' 
                       : 'bg-blue-100 text-blue-700'
                     }`}>
                       {ws.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setActiveWorkspace(ws.id)}
                      className={`text-sm font-bold transition hover:underline ${activeWorkspace?.id === ws.id ? 'text-gray-400 cursor-default no-underline' : 'text-thinklab-red'}`}
                    >
                      {activeWorkspace?.id === ws.id ? 'Viewing' : 'Manage'}
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
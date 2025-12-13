import React, { useState } from 'react';
import { Plus, Briefcase, Activity, AlertTriangle, ArrowRight, MapPin, X, Check, Trash2, CheckCircle, RotateCcw, Pencil, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Workspace } from '../types';

const WorkspaceManagement: React.FC = () => {
  const { workspaces, addWorkspace, deleteWorkspace, updateWorkspaceDetails, toggleWorkspaceStatus, updateWorkspaceProgress, setActiveWorkspace } = useApp();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    stage: 'Project Acquisition & Bidding' as string,
    type: 'Residential',
    budget: ''
  });

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({
      name: '',
      location: '',
      stage: 'Project Acquisition & Bidding',
      type: 'Residential',
      budget: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, ws: Workspace) => {
    e.stopPropagation();
    setIsEditMode(true);
    setEditingId(ws.id);
    setFormData({
      name: ws.name,
      location: ws.location,
      stage: ws.stage,
      type: ws.type || 'Residential',
      budget: ws.budget || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && editingId) {
      updateWorkspaceDetails(editingId, {
        name: formData.name,
        location: formData.location,
        stage: formData.stage,
        type: formData.type,
        budget: formData.budget
      });
    } else {
      addWorkspace({
        name: formData.name,
        location: formData.location,
        stage: formData.stage,
        type: formData.type,
        budget: formData.budget
      });
    }
    setIsModalOpen(false);
  };

  const handleOpenWorkspace = (id: string) => {
    setActiveWorkspace(id);
    navigate('/');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
     e.stopPropagation();
     if(window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
        deleteWorkspace(id);
     }
  };

  const handleToggleStatus = (e: React.MouseEvent, id: string) => {
     e.stopPropagation();
     toggleWorkspaceStatus(id);
  };

  const portfolioStats = {
    totalProjects: workspaces.length,
    activeProjects: workspaces.filter(w => w.status === 'Under Construction').length,
    completedProjects: workspaces.filter(w => w.status === 'Finished').length,
    avgProgress: workspaces.length > 0 ? Math.round(workspaces.reduce((acc, cur) => acc + cur.progress, 0) / workspaces.length) : 0,
  };

  return (
    <div className="space-y-8 relative pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-thinklab-black">Workspace Portfolio</h2>
           <p className="text-thinklab-grey mt-1">Manage all your construction sites from one central hub.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-thinklab-black text-white px-6 py-3 rounded-btn font-bold flex items-center hover:bg-gray-800 transition shadow-lg"
        >
           <Plus className="w-5 h-5 mr-2" />
           New Workspace
        </button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center">
            <div className="p-4 bg-gray-100 rounded-full mr-4 text-thinklab-black">
               <Briefcase className="w-6 h-6" />
            </div>
            <div>
               <p className="text-thinklab-grey text-xs uppercase tracking-wider font-bold">Active Projects</p>
               <h3 className="text-2xl font-bold text-thinklab-black">{portfolioStats.activeProjects} / {portfolioStats.totalProjects}</h3>
            </div>
         </div>
         
         <div className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center">
            <div className="p-4 bg-gray-100 rounded-full mr-4 text-thinklab-black">
               <Activity className="w-6 h-6" />
            </div>
            <div>
               <p className="text-thinklab-grey text-xs uppercase tracking-wider font-bold">Avg. Completion</p>
               <h3 className="text-2xl font-bold text-thinklab-black">{portfolioStats.avgProgress}%</h3>
            </div>
         </div>

         <div className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center">
            <div className="p-4 bg-green-50 rounded-full mr-4 text-green-600">
               <CheckCircle className="w-6 h-6" />
            </div>
            <div>
               <p className="text-thinklab-grey text-xs uppercase tracking-wider font-bold">Completed</p>
               <h3 className="text-2xl font-bold text-thinklab-black">{portfolioStats.completedProjects} Sites</h3>
            </div>
         </div>
      </div>

      {/* Projects Grid */}
      {workspaces.length === 0 ? (
          <div className="text-center py-20 bg-white rounded border border-dashed border-gray-300">
             <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-thinklab-black mb-2">No Workspaces Found</h3>
             <p className="text-thinklab-grey mb-6">Create your first construction project to get started.</p>
             <button 
                onClick={openCreateModal}
                className="bg-thinklab-red text-white px-6 py-3 rounded-btn font-bold inline-flex items-center hover:bg-red-700 transition"
             >
                <Plus className="w-5 h-5 mr-2" />
                Create Workspace
             </button>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {workspaces.map((ws) => (
              <div key={ws.id} className={`bg-white rounded shadow-sm border hover:shadow-md transition group flex flex-col relative overflow-hidden ${ws.status === 'Finished' ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
                 {ws.status === 'Finished' && (
                    <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl">COMPLETED</div>
                 )}
                 
                 <div className="h-32 bg-gray-200 w-full relative group-hover:bg-gray-300 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                       <Briefcase className="w-12 h-12 opacity-20" />
                    </div>
                    {ws.status !== 'Finished' && (
                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded text-xs font-bold text-thinklab-black shadow-sm truncate max-w-[150px]">
                        {ws.stage}
                        </div>
                    )}
                 </div>
                 
                 <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-thinklab-black group-hover:text-thinklab-red transition-colors">{ws.name}</h3>
                      <button 
                        onClick={(e) => openEditModal(e, ws)}
                        className="text-gray-400 hover:text-thinklab-black"
                        title="Edit Details"
                      >
                         <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center text-thinklab-grey text-sm mb-4">
                       <MapPin className="w-4 h-4 mr-1" />
                       {ws.location}
                    </div>
  
                    <div className="space-y-4 mt-auto">
                       <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                             <span className="text-thinklab-black">Progress</span>
                             <span className="text-thinklab-black">{ws.progress}%</span>
                          </div>
                          
                          {/* Interactive Slider for Progress */}
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={ws.progress} 
                            onChange={(e) => updateWorkspaceProgress(ws.id, parseInt(e.target.value))}
                            disabled={ws.status === 'Finished'}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-thinklab-black disabled:accent-gray-400 hover:accent-thinklab-red transition-colors"
                          />
                       </div>
  
                       <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-4">
                          <button 
                            onClick={(e) => handleDelete(e, ws.id)}
                            className="text-gray-400 hover:text-thinklab-red p-2 -ml-2 rounded-full hover:bg-red-50 transition"
                            title="Delete Workspace"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
  
                          <div className="flex items-center gap-2">
                             <button 
                                onClick={(e) => handleToggleStatus(e, ws.id)}
                                className={`text-xs font-bold px-2 py-1 rounded border transition flex items-center ${ws.status === 'Finished' ? 'bg-white border-green-600 text-green-600 hover:bg-green-50' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                             >
                                {ws.status === 'Finished' ? <RotateCcw className="w-3 h-3 mr-1"/> : <Check className="w-3 h-3 mr-1"/>}
                                {ws.status === 'Finished' ? 'Reopen' : 'Finish'}
                             </button>
  
                             <button 
                               onClick={() => handleOpenWorkspace(ws.id)}
                               className="text-sm font-bold text-thinklab-black flex items-center hover:text-thinklab-red transition ml-2"
                             >
                                Open <ArrowRight className="w-4 h-4 ml-1" />
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           ))}
           
           {/* Create New Card Placeholder */}
           <button 
             onClick={openCreateModal}
             className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center p-6 text-gray-400 hover:border-thinklab-red hover:text-thinklab-red transition bg-gray-50 h-full min-h-[300px]"
           >
              <Plus className="w-12 h-12 mb-4" />
              <span className="font-bold">Create New Workspace</span>
           </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-thinklab-black text-white p-4 flex justify-between items-center">
               <h3 className="font-bold text-lg">{isEditMode ? 'Edit Workspace' : 'Create New Workspace'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white">
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-bold text-thinklab-black mb-1">Project Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded focus:border-thinklab-black focus:ring-1 outline-none"
                    placeholder="e.g. Skyline Towers"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-thinklab-black mb-1">Location</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-3 border border-gray-300 rounded focus:border-thinklab-black focus:ring-1 outline-none"
                      placeholder="e.g. Victoria Island"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-thinklab-black mb-1">Project Type</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded focus:border-thinklab-black focus:ring-1 outline-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Industrial</option>
                      <option>Infrastructure</option>
                    </select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-bold text-thinklab-black mb-1">Budget (₦)</label>
                     <input 
                       type="text" 
                       className="w-full p-3 border border-gray-300 rounded focus:border-thinklab-black focus:ring-1 outline-none"
                       placeholder="e.g. 50,000,000"
                       value={formData.budget}
                       onChange={(e) => setFormData({...formData, budget: e.target.value})}
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-thinklab-black mb-1">Current Stage</label>
                     <select 
                       className="w-full p-3 border border-gray-300 rounded focus:border-thinklab-black focus:ring-1 outline-none"
                       value={formData.stage}
                       onChange={(e) => setFormData({...formData, stage: e.target.value})}
                     >
                       <option>Project Acquisition & Bidding</option>
                       <option>Project Planning & Design</option>
                       <option>Procurement & Mobilization</option>
                       <option>Construction & Project Execution</option>
                       <option>Project Close-out</option>
                     </select>
                  </div>
               </div>

               <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-gray-300 rounded font-bold text-thinklab-grey hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-thinklab-red text-white rounded font-bold hover:bg-red-700 transition shadow-lg flex justify-center items-center"
                  >
                    {isEditMode ? <Save className="w-5 h-5 mr-2" /> : <Check className="w-5 h-5 mr-2" />}
                    {isEditMode ? 'Save Changes' : 'Create Project'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceManagement;

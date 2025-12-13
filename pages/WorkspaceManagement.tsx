import React, { useState } from 'react';
import { 
  Plus, 
  Briefcase, 
  Activity, 
  MapPin, 
  X, 
  Check, 
  Trash2, 
  RotateCcw, 
  Pencil, 
  Save, 
  LayoutGrid, 
  List as ListIcon, 
  Search, 
  Filter, 
  MoreVertical,
  Building2,
  Calendar,
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Workspace } from '../types';

const WorkspaceManagement: React.FC = () => {
  const { workspaces, addWorkspace, deleteWorkspace, updateWorkspaceDetails, toggleWorkspaceStatus, updateWorkspaceProgress, setActiveWorkspace } = useApp();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  
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

  // Filter & Search Logic
  const filteredWorkspaces = workspaces.filter(ws => {
      const matchesSearch = ws.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            ws.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'All' || ws.status === filterType || (filterType === 'Active' && ws.status === 'Under Construction');
      
      return matchesSearch && matchesFilter;
  });

  const portfolioStats = {
    totalProjects: workspaces.length,
    activeProjects: workspaces.filter(w => w.status === 'Under Construction').length,
    completedProjects: workspaces.filter(w => w.status === 'Finished').length,
    avgProgress: workspaces.length > 0 ? Math.round(workspaces.reduce((acc, cur) => acc + cur.progress, 0) / workspaces.length) : 0,
  };

  return (
    <div className="space-y-8 relative pb-20 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-serif font-bold text-thinklab-black">Workspace Portfolio</h2>
                <p className="text-gray-500 mt-1">Manage your construction projects, track progress, and monitor sites.</p>
            </div>
            <button 
            onClick={openCreateModal}
            className="bg-thinklab-black text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-gray-800 transition shadow-lg group"
            >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
            New Workspace
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-600"><Briefcase className="w-5 h-5"/></div>
                  <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Total</p>
                      <p className="text-xl font-bold text-thinklab-black">{portfolioStats.totalProjects}</p>
                  </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Activity className="w-5 h-5"/></div>
                  <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Active</p>
                      <p className="text-xl font-bold text-thinklab-black">{portfolioStats.activeProjects}</p>
                  </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle2 className="w-5 h-5"/></div>
                  <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Completed</p>
                      <p className="text-xl font-bold text-thinklab-black">{portfolioStats.completedProjects}</p>
                  </div>
              </div>
               <div className="bg-white p-4 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><Activity className="w-5 h-5"/></div>
                  <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Avg. Progress</p>
                      <p className="text-xl font-bold text-thinklab-black">{portfolioStats.avgProgress}%</p>
                  </div>
              </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex-1 relative w-full">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                 <input 
                    type="text" 
                    placeholder="Search projects by name or location..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-thinklab-black placeholder-gray-400"
                 />
             </div>
             <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
             <div className="flex items-center gap-2 w-full md:w-auto">
                 <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                     <Filter className="w-4 h-4 text-gray-500" />
                     <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                     >
                         <option value="All">All Status</option>
                         <option value="Active">Active</option>
                         <option value="Finished">Completed</option>
                     </select>
                 </div>
                 <div className="flex bg-gray-100 p-1 rounded-lg">
                     <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-thinklab-black' : 'text-gray-400 hover:text-gray-600'}`}
                     >
                         <LayoutGrid className="w-4 h-4" />
                     </button>
                     <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-thinklab-black' : 'text-gray-400 hover:text-gray-600'}`}
                     >
                         <ListIcon className="w-4 h-4" />
                     </button>
                 </div>
             </div>
          </div>
      </div>

      {workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-fade-in-up">
            <div className="w-24 h-24 bg-gray-100/50 rounded-full flex items-center justify-center mb-2">
                <Building2 className="w-10 h-10 text-gray-300" />
            </div>
            <div>
                 <h3 className="text-xl font-bold text-thinklab-black">No Workspaces Found</h3>
                 <p className="text-gray-500 mt-2">Get started by creating your first construction workspace.</p>
            </div>
             <button 
                onClick={openCreateModal}
                className="bg-thinklab-red text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition shadow-lg"
             >
                <Plus className="w-5 h-5" />
                Create Workspace
             </button>
          </div>
      ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
             {filteredWorkspaces.map((ws, index) => (
                viewMode === 'grid' ? (
                    // GRID CARD VIEW
                    <div 
                        key={ws.id} 
                        className="bg-white rounded-2xl shadow-soft border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => setActiveWorkspace(ws.id)}
                    >
                        {/* Card Header/Preview */}
                        <div className={`h-40 relative overflow-hidden transition-colors ${ws.status === 'Finished' ? 'bg-green-50' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="w-16 h-16 opacity-10 text-thinklab-black" />
                            </div>
                            <div className="absolute top-4 left-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-serif font-bold text-thinklab-black shadow-sm">
                                    {ws.name.substring(0,2).toUpperCase()}
                                </div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider shadow-sm ${
                                    ws.status === 'Finished' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-white text-thinklab-black'
                                }`}>
                                    {ws.status}
                                </span>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-thinklab-black group-hover:text-thinklab-red transition-colors line-clamp-1 cursor-pointer" onClick={() => { setActiveWorkspace(ws.id); navigate('/'); }}>
                                        {ws.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                        <MapPin className="w-3 h-3 mr-1" /> {ws.location}
                                    </p>
                                </div>
                                <button 
                                    onClick={(e) => openEditModal(e, ws)}
                                    className="text-gray-300 hover:text-thinklab-black transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1.5">
                                        <span className="text-gray-500">Progress</span>
                                        <span className={ws.progress === 100 ? "text-green-600" : "text-thinklab-black"}>{ws.progress}%</span>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="100" 
                                            value={ws.progress} 
                                            onChange={(e) => updateWorkspaceProgress(ws.id, parseInt(e.target.value))}
                                            disabled={ws.status === 'Finished'}
                                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-thinklab-black disabled:accent-green-500 hover:accent-thinklab-red transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-500 font-medium border border-gray-100">
                                        {ws.stage}
                                    </span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => handleDelete(e, ws.id)}
                                            className="p-2 text-gray-300 hover:text-thinklab-red transition-colors rounded-full hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setActiveWorkspace(ws.id); navigate('/'); }}
                                            className="p-2 bg-thinklab-black text-white rounded-lg hover:bg-thinklab-red transition-colors shadow-md"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // LIST ROW VIEW
                    <div 
                        key={ws.id} 
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-all flex items-center justify-between group animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => setActiveWorkspace(ws.id)}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-serif font-bold text-thinklab-black text-lg">
                                {ws.name.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-thinklab-black group-hover:text-thinklab-red transition-colors cursor-pointer">{ws.name}</h3>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {ws.location}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{ws.stage}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 mr-4">
                            <div className="w-32">
                                <div className="flex justify-between text-[10px] font-bold mb-1">
                                    <span className="text-gray-400">Progress</span>
                                    <span>{ws.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full ${ws.progress === 100 ? 'bg-green-500' : 'bg-thinklab-black'}`} style={{width: `${ws.progress}%`}}></div>
                                </div>
                            </div>

                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                ws.status === 'Finished' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                                {ws.status}
                            </span>
                        </div>

                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => openEditModal(e, ws)} className="p-2 hover:bg-gray-100 rounded text-gray-500">
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => handleDelete(e, ws.id)} className="p-2 hover:bg-red-50 rounded text-gray-500 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                            </button>
                             <button onClick={() => { setActiveWorkspace(ws.id); navigate('/'); }} className="p-2 hover:bg-gray-100 rounded text-thinklab-black">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                         </div>
                    </div>
                )
             ))}
          </div>
      )}

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="bg-thinklab-black text-white p-6 flex justify-between items-center bg-[url('https://grain-url-placeholder')]">
               <div>
                   <h3 className="font-serif font-bold text-xl">{isEditMode ? 'Edit Project' : 'New Project'}</h3>
                   <p className="text-gray-400 text-xs mt-1">Enter the details for your construction workspace</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition p-2 hover:bg-white/10 rounded-full">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Project Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all placeholder:text-gray-300 font-medium"
                    placeholder="e.g. Skyline Towers"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                        required
                        type="text" 
                        className="w-full pl-9 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Project Type</label>
                    <select 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
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
                     <label className="block text-sm font-bold text-gray-700 mb-1.5">Budget (₦)</label>
                     <input 
                       type="text" 
                       className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
                       placeholder="50,000,000"
                       value={formData.budget}
                       onChange={(e) => {
                           const value = e.target.value.replace(/[^0-9]/g, '');
                           const formatted = value ? parseInt(value).toLocaleString() : '';
                           setFormData({...formData, budget: formatted});
                       }}
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1.5">Current Stage</label>
                     <select 
                       className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
                       value={formData.stage}
                       onChange={(e) => setFormData({...formData, stage: e.target.value})}
                     >
                       <option>Acquisition & Bidding</option>
                       <option>Planning & Design</option>
                       <option>Procurement</option>
                       <option>Construction</option>
                       <option>Close-out</option>
                     </select>
                  </div>
               </div>

               <div className="pt-6 flex gap-3 border-t border-gray-100 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-thinklab-black transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-thinklab-black text-white rounded-xl font-bold hover:bg-thinklab-red transition-colors shadow-lg shadow-gray-200 flex justify-center items-center"
                  >
                    {isEditMode ? <Save className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
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

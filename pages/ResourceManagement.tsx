import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingDown, Plus, Minus, Briefcase, ChevronDown, Sparkles, Trash2, X, Save, Loader2, Check, AlertCircle, Package, TrendingUp, Search, Filter } from 'lucide-react';
import { getResourceRecommendations, generateResourceAllocation } from '../services/geminiService';
import { useApp } from '../context/AppContext';
import { ResourceItem } from '../types';

const ResourceManagement: React.FC = () => {
  const { workspaces, activeWorkspace, updateResourceQuantity, setActiveWorkspace, setWorkspaceResources, addResourceToWorkspace, deleteResourceFromWorkspace } = useApp();
  const [recommendation, setRecommendation] = useState<string>('Loading AI insights...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Local state for modals/loading
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newResource, setNewResource] = useState({ name: '', quantity: 0, unit: '', threshold: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  // AI Review State
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [suggestedResources, setSuggestedResources] = useState<ResourceItem[]>([]);

  // Determine which resources to display
  let displayResources: ResourceItem[] = [];
  let isEditable = false;

  if (activeWorkspace) {
    displayResources = activeWorkspace.resources;
    isEditable = true;
  } else {
    // Aggregate resources for global view
    const aggMap = new Map<string, ResourceItem>();
    workspaces.forEach(ws => {
      ws.resources.forEach(r => {
        if (aggMap.has(r.name)) {
          const existing = aggMap.get(r.name)!;
          aggMap.set(r.name, { ...existing, quantity: existing.quantity + r.quantity });
        } else {
          aggMap.set(r.name, { ...r }); // Clone to avoid mutation issues
        }
      });
    });
    displayResources = Array.from(aggMap.values());
  }

  // Filter resources
  const filteredResources = displayResources.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate Metrics
  const totalItems = displayResources.length;
  const criticalItems = displayResources.filter(r => r.status === 'Critical').length;
  const lowItems = displayResources.filter(r => r.status === 'Low').length;

  useEffect(() => {
    getResourceRecommendations(displayResources).then(setRecommendation);
  }, [displayResources]);

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'global') {
      setActiveWorkspace(null);
    } else {
      setActiveWorkspace(val);
    }
  };

  const handleAIAllocations = async () => {
     if(!activeWorkspace) return;
     
     setIsGenerating(true);
     setErrorMsg(null);
     try {
        const aiResources = await generateResourceAllocation(
           activeWorkspace.type || 'Construction',
           activeWorkspace.stage,
           activeWorkspace.budget || 'Unknown'
        );

        if(aiResources) {
           setSuggestedResources(aiResources);
           setIsSuggestionModalOpen(true);
        }
     } catch (error: any) {
        setErrorMsg(error.message || "Failed to generate resource plan.");
     } finally {
        setIsGenerating(false);
     }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if(activeWorkspace) {
        addResourceToWorkspace(activeWorkspace.id, {
           ...newResource,
           status: newResource.quantity <= newResource.threshold ? 'Low' : 'Good'
        });
        setIsAddModalOpen(false);
        setNewResource({ name: '', quantity: 0, unit: '', threshold: 0 });
     }
  };

  const handleUpdateSuggestion = (index: number, field: keyof ResourceItem, value: any) => {
    const updated = [...suggestedResources];
    // @ts-ignore
    updated[index] = { ...updated[index], [field]: value };
    // Recalculate status if quantity or threshold changes
    if (field === 'quantity' || field === 'threshold') {
        const q = field === 'quantity' ? value : updated[index].quantity;
        const t = field === 'threshold' ? value : updated[index].threshold;
        updated[index].status = q <= t * 0.5 ? 'Critical' : q <= t ? 'Low' : 'Good';
    }
    setSuggestedResources(updated);
  };

  const handleDeleteSuggestion = (index: number) => {
    setSuggestedResources(prev => prev.filter((_, i) => i !== index));
  };

  const confirmSuggestions = () => {
    if(activeWorkspace) {
        setWorkspaceResources(activeWorkspace.id, suggestedResources);
        setIsSuggestionModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header & Metrics */}
       <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
           <div className="max-w-2xl">
              <h2 className="text-3xl font-serif font-bold text-thinklab-black">Resource Director</h2>
              <div className="flex items-center gap-2 mt-2">
                 <div className={`w-2 h-2 rounded-full ${criticalItems > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                 <p className="text-thinklab-grey text-sm">
                   {activeWorkspace ? `Inventory management for ${activeWorkspace.name}` : "Global inventory control center"}
                 </p>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-4">
              {/* Workspace Selector */}
              <div className="relative w-full md:w-64">
                <select
                  onChange={handleWorkspaceChange}
                  value={activeWorkspace?.id || 'global'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-bold text-thinklab-black bg-white focus:outline-none focus:ring-2 focus:ring-thinklab-black appearance-none cursor-pointer shadow-sm hover:border-thinklab-black transition-colors"
                >
                  <option value="global">Global View (All Sites)</option>
                  <option disabled>──────────────</option>
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name}</option>
                  ))}
                </select>
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {activeWorkspace && (
                 <div className="flex gap-2">
                    <button 
                       onClick={() => setIsAddModalOpen(true)}
                       className="px-4 py-3 bg-white border border-gray-200 text-thinklab-black font-bold rounded-xl hover:bg-gray-50 flex items-center shadow-sm transition-transform active:scale-95"
                    >
                       <Plus className="w-4 h-4 mr-2" /> Add Item
                    </button>
                    <button 
                       onClick={handleAIAllocations}
                       disabled={isGenerating}
                       className="px-4 py-3 bg-thinklab-black text-white font-bold rounded-xl hover:bg-gray-800 flex items-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-xl active:scale-95"
                    >
                       {isGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />} 
                       AI Planner
                    </button>
                 </div>
              )}
           </div>
       </div>

       {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start animate-fade-in-up">
             <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
             <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

       {/* Metrics Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center justify-between">
               <div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Inventory Types</p>
                   <p className="text-3xl font-bold text-thinklab-black mt-1">{totalItems}</p>
               </div>
               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-thinklab-black">
                   <Package size={24} />
               </div>
           </div>
           
           <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center justify-between">
               <div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Stock Alerts</p>
                   <p className="text-3xl font-bold text-thinklab-black mt-1">{lowItems + criticalItems}</p>
               </div>
               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lowItems + criticalItems > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                   <AlertTriangle size={24} />
               </div>
           </div>

           <div className="bg-gradient-to-r from-thinklab-black to-gray-800 p-6 rounded-2xl shadow-soft text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
               <div className="relative z-10">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                       <Sparkles size={12} className="text-yellow-400"/> AI Insight
                   </p>
                   <p className="mt-2 text-sm text-gray-200 leading-relaxed italic">
                       "{recommendation}"
                   </p>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          {/* Inventory List */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden flex flex-col">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="font-bold text-thinklab-black text-lg flex items-center">
                   <Package className="w-5 h-5 mr-2 text-thinklab-black" />
                   Inventory List
                </h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search items..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-thinklab-black transition-all w-48 focus:w-64"
                    />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {filteredResources.length === 0 && (
                   <div className="flex flex-col items-center justify-center h-full text-gray-400">
                       <Package size={48} className="opacity-20 mb-4"/>
                       <p>No inventory items found.</p>
                   </div>
                )}
                
                {filteredResources.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-gray-300 transition-all">
                     <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded-full ${item.status === 'Critical' ? 'bg-red-500' : item.status === 'Low' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                        <div>
                            <h4 className="font-bold text-thinklab-black">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.status === 'Critical' ? 'bg-red-100 text-red-600' : item.status === 'Low' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {item.status}
                                </span>
                                <span className="text-xs text-thinklab-grey">Min: {item.threshold} {item.unit}</span>
                            </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="text-right">
                            <span className="block text-xl font-bold text-thinklab-black">{item.quantity}</span>
                            <span className="text-xs text-gray-400">{item.unit}</span>
                        </div>
                        
                        {isEditable && activeWorkspace && (
                          <div className="flex items-center gap-2 opacity-100">
                             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                                <button 
                                  onClick={() => updateResourceQuantity(activeWorkspace.id, item.id, Math.max(0, item.quantity - 5))}
                                  className="p-2 hover:bg-gray-200 text-gray-600 border-r border-gray-200 transition-colors"
                                >
                                   <Minus size={14} />
                                </button>
                                <button 
                                  onClick={() => updateResourceQuantity(activeWorkspace.id, item.id, item.quantity + 5)}
                                  className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                                >
                                   <Plus size={14} />
                                </button>
                             </div>
                             <button 
                                onClick={() => deleteResourceFromWorkspace(activeWorkspace.id, item.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                             >
                                <Trash2 size={18} />
                             </button>
                          </div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Chart Panel */}
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6 flex flex-col">
             <h3 className="font-bold text-thinklab-black mb-6">Stock Distribution</h3>
             <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={displayResources} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                   <Tooltip 
                     cursor={{fill: '#f9fafb'}}
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                   />
                   <Bar dataKey="quantity" radius={[0, 4, 4, 0]} barSize={20}>
                     {displayResources.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.status === 'Critical' ? '#ef4444' : entry.status === 'Low' ? '#facc15' : '#1f2937'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
       </div>

       {/* Add Resource Modal */}
       {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-thinklab-black text-white p-6 flex justify-between items-center">
                   <h3 className="font-bold text-lg">Add New Resource</h3>
                   <button onClick={() => setIsAddModalOpen(false)} className="text-white/70 hover:text-white"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleAddSubmit} className="p-8 space-y-5">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Resource Name</label>
                      <input 
                         required
                         type="text" 
                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-thinklab-black outline-none transition-all"
                         placeholder="e.g. Paint Buckets"
                         value={newResource.name}
                         onChange={e => setNewResource({...newResource, name: e.target.value})}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                         <input 
                            required
                            type="number" 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-thinklab-black outline-none transition-all"
                            value={newResource.quantity}
                            onChange={e => setNewResource({...newResource, quantity: parseInt(e.target.value) || 0})}
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit</label>
                         <input 
                            required
                            type="text" 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-thinklab-black outline-none transition-all"
                            placeholder="e.g. L"
                            value={newResource.unit}
                            onChange={e => setNewResource({...newResource, unit: e.target.value})}
                         />
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Low Stock Threshold</label>
                      <input 
                         required
                         type="number" 
                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-thinklab-black outline-none transition-all"
                         value={newResource.threshold}
                         onChange={e => setNewResource({...newResource, threshold: parseInt(e.target.value) || 0})}
                      />
                   </div>
                   <button type="submit" className="w-full bg-thinklab-black text-white font-bold py-4 rounded-xl mt-4 hover:bg-gray-800 transition shadow-lg">Confirm Addition</button>
                </form>
             </div>
          </div>
       )}

       {/* AI Suggestion Review Modal */}
       {isSuggestionModalOpen && activeWorkspace && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="bg-thinklab-black text-white p-6 flex justify-between items-center">
                   <div>
                      <h3 className="font-bold text-xl flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400"/> AI Resource Planner
                      </h3>
                      <p className="text-white/60 text-sm mt-1">Generating plan for <span className="text-white font-bold border-b border-white/30">{activeWorkspace.stage}</span> phase</p>
                   </div>
                   <button onClick={() => setIsSuggestionModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"><X className="w-5 h-5"/></button>
                </div>
                
                <div className="p-6 bg-blue-50 border-b border-blue-100 flex items-start gap-4 mx-6 mt-6 rounded-xl">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-blue-900 font-bold mb-1">Review Generated Plan</p>
                        <p className="text-sm text-blue-800/80 leading-relaxed">
                            The AI has analyzed your project type and phase to generate this resource list. 
                            Confirming this plan will <span className="font-bold underline">replace your current inventory</span> for this workspace.
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {suggestedResources.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all items-end">
                            <div className="col-span-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Item Name</label>
                                <input 
                                    type="text" 
                                    value={item.name} 
                                    onChange={(e) => handleUpdateSuggestion(index, 'name', e.target.value)}
                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Qty</label>
                                <input 
                                    type="number" 
                                    value={item.quantity} 
                                    onChange={(e) => handleUpdateSuggestion(index, 'quantity', parseInt(e.target.value) || 0)}
                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Unit</label>
                                <input 
                                    type="text" 
                                    value={item.unit} 
                                    onChange={(e) => handleUpdateSuggestion(index, 'unit', e.target.value)}
                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Min Limit</label>
                                <input 
                                    type="number" 
                                    value={item.threshold} 
                                    onChange={(e) => handleUpdateSuggestion(index, 'threshold', parseInt(e.target.value) || 0)}
                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none"
                                />
                            </div>
                             <div className="col-span-2 flex justify-end pb-1">
                                <button 
                                    onClick={() => handleDeleteSuggestion(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                             </div>
                        </div>
                    ))}
                    {suggestedResources.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400">No items available.</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsSuggestionModalOpen(false)}
                        className="px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-500 hover:bg-white hover:text-thinklab-black transition"
                    >
                        Discard Plan
                    </button>
                    <button 
                        onClick={confirmSuggestions}
                        disabled={suggestedResources.length === 0}
                        className="px-6 py-3 bg-thinklab-black text-white rounded-xl font-bold hover:bg-gray-800 shadow-lg flex items-center transition disabled:opacity-50"
                    >
                        <Check className="w-5 h-5 mr-2" />
                        Apply Resource Plan
                    </button>
                </div>
             </div>
           </div>
       )}
    </div>
  );
};

export default ResourceManagement;
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingDown, Plus, Minus, Briefcase, ChevronDown, Sparkles, Trash2, X, Save, Loader2, Check, AlertCircle } from 'lucide-react';
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
    <div className="space-y-6">
       <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-bold text-thinklab-black">Resource Management</h2>
              <p className="text-thinklab-grey mt-1">
                {activeWorkspace ? `Managing stock for ${activeWorkspace.name}` : "Global Inventory Overview"}
              </p>
           </div>

           <div className="flex flex-col md:flex-row gap-4">
              {/* Workspace Selector */}
              <div className="relative w-full md:w-64">
                <select
                  onChange={handleWorkspaceChange}
                  value={activeWorkspace?.id || 'global'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded font-bold text-thinklab-black bg-white focus:outline-none focus:border-thinklab-black appearance-none cursor-pointer"
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

              {/* Action Buttons */}
              {activeWorkspace && (
                 <div className="flex gap-2">
                    <button 
                       onClick={() => setIsAddModalOpen(true)}
                       className="px-4 py-3 bg-white border border-gray-300 text-thinklab-black font-bold rounded hover:bg-gray-50 flex items-center shadow-sm"
                    >
                       <Plus className="w-4 h-4 mr-2" /> Add Item
                    </button>
                    <button 
                       onClick={handleAIAllocations}
                       disabled={isGenerating}
                       className="px-4 py-3 bg-thinklab-black text-white font-bold rounded hover:bg-gray-800 flex items-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                       {isGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Sparkles className="w-4 h-4 mr-2" />} 
                       AI Resource Planner
                    </button>
                 </div>
              )}
           </div>
       </div>

       {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start">
             <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
             <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

       {!activeWorkspace && (
         <div className="text-xs text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded border border-amber-100">
           Viewing global aggregate. Select a workspace above to allocate resources.
         </div>
       )}

       {/* AI Insight Box */}
       <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md border-l-4 border-thinklab-red">
          <h3 className="text-sm font-bold uppercase tracking-wider text-thinklab-red mb-2">ThinkLab AI Recommendation</h3>
          <p className="text-gray-300 italic">"{recommendation}"</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded shadow-sm border border-gray-100">
             <h3 className="font-bold text-thinklab-black mb-6">Inventory Levels</h3>
             <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={displayResources} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#767070'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#767070'}} />
                   <Tooltip 
                     cursor={{fill: '#f9fafb'}}
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                   />
                   <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
                     {displayResources.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.status === 'Critical' ? '#FE0000' : entry.status === 'Low' ? '#FBBF24' : '#000000'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Stock List Table */}
          <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[450px]">
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-thinklab-black flex items-center">
                   <AlertTriangle className="w-5 h-5 mr-2 text-thinklab-grey" />
                   Stock Details
                </h3>
             </div>
             <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
                {displayResources.length === 0 && (
                   <div className="p-8 text-center text-gray-400">No resources allocated.</div>
                )}
                {displayResources.map(item => (
                  <div key={item.id} className="p-4 flex justify-between items-center group hover:bg-gray-50">
                     <div>
                        <p className="font-bold text-thinklab-black">{item.name}</p>
                        <p className="text-xs text-thinklab-grey mb-1">Threshold: {item.threshold}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.status === 'Critical' ? 'bg-red-100 text-red-600' : item.status === 'Low' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                           {item.status}
                        </span>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="text-right">
                           <div className="text-sm font-bold text-thinklab-black">{item.quantity} {item.unit}</div>
                        </div>
                        
                        {isEditable && activeWorkspace && (
                          <div className="flex items-center gap-2">
                             <div className="flex items-center bg-white border rounded shadow-sm opacity-50 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => updateResourceQuantity(activeWorkspace.id, item.id, Math.max(0, item.quantity - 10))}
                                  className="p-1 hover:bg-gray-100 text-thinklab-red"
                                >
                                   <Minus size={14} />
                                </button>
                                <div className="w-px h-4 bg-gray-200"></div>
                                <button 
                                  onClick={() => updateResourceQuantity(activeWorkspace.id, item.id, item.quantity + 10)}
                                  className="p-1 hover:bg-gray-100 text-green-600"
                                >
                                   <Plus size={14} />
                                </button>
                             </div>
                             <button 
                                onClick={() => deleteResourceFromWorkspace(activeWorkspace.id, item.id)}
                                className="text-gray-300 hover:text-thinklab-red opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                <Trash2 size={14} />
                             </button>
                          </div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>

       {/* Add Resource Modal */}
       {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
             <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="bg-thinklab-black text-white p-4 flex justify-between items-center">
                   <h3 className="font-bold">Add New Resource</h3>
                   <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                   <div>
                      <label className="block text-sm font-bold mb-1">Resource Name</label>
                      <input 
                         required
                         type="text" 
                         className="w-full p-2 border rounded"
                         placeholder="e.g. Paint Buckets"
                         value={newResource.name}
                         onChange={e => setNewResource({...newResource, name: e.target.value})}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-bold mb-1">Quantity</label>
                         <input 
                            required
                            type="number" 
                            className="w-full p-2 border rounded"
                            value={newResource.quantity}
                            onChange={e => setNewResource({...newResource, quantity: parseInt(e.target.value) || 0})}
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold mb-1">Unit</label>
                         <input 
                            required
                            type="text" 
                            className="w-full p-2 border rounded"
                            placeholder="e.g. Liters"
                            value={newResource.unit}
                            onChange={e => setNewResource({...newResource, unit: e.target.value})}
                         />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-bold mb-1">Low Stock Threshold</label>
                      <input 
                         required
                         type="number" 
                         className="w-full p-2 border rounded"
                         value={newResource.threshold}
                         onChange={e => setNewResource({...newResource, threshold: parseInt(e.target.value) || 0})}
                      />
                   </div>
                   <button type="submit" className="w-full bg-thinklab-black text-white font-bold py-3 rounded mt-2">Add to Inventory</button>
                </form>
             </div>
          </div>
       )}

       {/* AI Suggestion Review Modal */}
       {isSuggestionModalOpen && activeWorkspace && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
             <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="bg-thinklab-black text-white p-4 flex justify-between items-center">
                   <div>
                      <h3 className="font-bold text-lg flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-400"/> AI Suggested Resources
                      </h3>
                      <p className="text-xs text-gray-300">Based on stage: <span className="text-white font-bold">{activeWorkspace.stage}</span></p>
                   </div>
                   <button onClick={() => setIsSuggestionModalOpen(false)}><X className="w-6 h-6"/></button>
                </div>
                
                <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                        Review the generated list below. You can adjust quantities or remove items before linking them to <strong>{activeWorkspace.name}</strong>. 
                        <br/><span className="font-bold">Note: This will replace the current inventory list.</span>
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {suggestedResources.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 border rounded bg-gray-50 items-start sm:items-center">
                            <div className="flex-1 w-full">
                                <label className="text-xs font-bold text-thinklab-grey">Name</label>
                                <input 
                                    type="text" 
                                    value={item.name} 
                                    onChange={(e) => handleUpdateSuggestion(index, 'name', e.target.value)}
                                    className="w-full p-2 border rounded text-sm font-bold text-thinklab-black"
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-xs font-bold text-thinklab-grey">Quantity</label>
                                <input 
                                    type="number" 
                                    value={item.quantity} 
                                    onChange={(e) => handleUpdateSuggestion(index, 'quantity', parseInt(e.target.value) || 0)}
                                    className="w-full p-2 border rounded text-sm font-bold text-thinklab-black"
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-xs font-bold text-thinklab-grey">Unit</label>
                                <input 
                                    type="text" 
                                    value={item.unit} 
                                    onChange={(e) => handleUpdateSuggestion(index, 'unit', e.target.value)}
                                    className="w-full p-2 border rounded text-sm font-bold text-thinklab-black"
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-xs font-bold text-thinklab-grey">Threshold</label>
                                <input 
                                    type="number" 
                                    value={item.threshold} 
                                    onChange={(e) => handleUpdateSuggestion(index, 'threshold', parseInt(e.target.value) || 0)}
                                    className="w-full p-2 border rounded text-sm font-bold text-thinklab-black"
                                />
                            </div>
                             <div className="flex items-center pt-5">
                                <button 
                                    onClick={() => handleDeleteSuggestion(index)}
                                    className="p-2 text-gray-400 hover:text-thinklab-red transition"
                                    title="Remove Item"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                             </div>
                        </div>
                    ))}
                    {suggestedResources.length === 0 && (
                        <p className="text-center text-gray-400 py-8">No items in suggestion list.</p>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsSuggestionModalOpen(false)}
                        className="px-6 py-3 border border-gray-300 rounded font-bold text-thinklab-grey hover:bg-white"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmSuggestions}
                        disabled={suggestedResources.length === 0}
                        className="px-6 py-3 bg-thinklab-red text-white rounded font-bold hover:bg-red-700 shadow-lg flex items-center"
                    >
                        <Check className="w-5 h-5 mr-2" />
                        Confirm & Link to Workspace
                    </button>
                </div>
             </div>
           </div>
       )}
    </div>
  );
};

export default ResourceManagement;
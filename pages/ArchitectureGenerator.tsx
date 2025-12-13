import React, { useState, useEffect } from 'react';
import { generateArchitecturePlan } from '../services/geminiService';
import { GeneratedArchitecture } from '../types';
import { Loader2, CheckCircle, Clock, Hammer, DollarSign, FileText, Save, Briefcase, PlayCircle, ChevronDown, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ArchitectureGenerator: React.FC = () => {
  const { activeWorkspace, saveArchitectureToWorkspace, workspaces, setActiveWorkspace } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedArchitecture | null>(null);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: activeWorkspace?.type || 'Residential Duplex',
    landSize: '600sqm',
    floors: '2',
    budget: activeWorkspace?.budget || '50000000',
    purpose: 'Family Home'
  });

  useEffect(() => {
    // If opening from a workspace that has a plan, load it
    if (activeWorkspace) {
      setFormData(prev => ({
        ...prev,
        type: activeWorkspace.type || prev.type,
        budget: activeWorkspace.budget || prev.budget
      }));
      
      if (activeWorkspace.architecturePlan) {
        setResult(activeWorkspace.architecturePlan);
        setSaved(true);
      } else {
        setResult(null);
        setSaved(false);
      }
      setErrorMsg(null);
    }
  }, [activeWorkspace]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSaved(false);
    setErrorMsg(null);
    try {
        const data = await generateArchitecturePlan(formData.type, formData.landSize, formData.floors, formData.budget);
        setResult(data);
    } catch (error: any) {
        setErrorMsg(error.message || "Failed to generate plan.");
    } finally {
        setLoading(false);
    }
  };

  const handleSave = () => {
    if (activeWorkspace && result) {
      saveArchitectureToWorkspace(activeWorkspace.id, result);
      setSaved(true);
    }
  };

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setActiveWorkspace(e.target.value);
    }
  };

  if (!activeWorkspace) {
    return (
       <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
             <Briefcase className="w-8 h-8 text-thinklab-grey"/>
          </div>
          <h2 className="text-2xl font-bold text-thinklab-black">Select a Workspace</h2>
          <p className="text-thinklab-grey mt-2 mb-6 max-w-md">
            To generate an architecture plan, please select which project this plan belongs to.
          </p>
          
          <div className="w-full max-w-xs relative">
             <select 
                onChange={handleWorkspaceChange}
                className="w-full p-4 border border-gray-300 rounded appearance-none font-bold text-thinklab-black bg-white focus:ring-2 focus:ring-thinklab-red focus:outline-none cursor-pointer shadow-sm"
                defaultValue=""
             >
                <option value="" disabled>Choose a Workspace...</option>
                {workspaces.map(ws => (
                   <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
          </div>

          <p className="mt-8 text-sm text-gray-400">
             Or <button onClick={() => navigate('/workspaces')} className="text-thinklab-red font-bold hover:underline">create a new workspace</button>
          </p>
       </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-start">
           <div>
             <h2 className="text-2xl font-bold text-thinklab-black">AI Lifecycle Planner</h2>
             <p className="text-thinklab-grey mt-1">
                Drafting execution plan for <span className="font-bold text-thinklab-black">{activeWorkspace.name}</span>
             </p>
           </div>
           
           {/* Quick Switcher */}
           <div className="relative">
              <select 
                 onChange={handleWorkspaceChange}
                 value={activeWorkspace.id}
                 className="pl-3 pr-8 py-1 border border-gray-200 rounded text-xs font-bold bg-white text-thinklab-grey cursor-pointer hover:border-thinklab-black focus:outline-none appearance-none"
              >
                 {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name}</option>
                 ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-3 h-3" />
           </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start">
             <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
             <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleGenerate} className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-4">
           <div>
             <label className="block text-sm font-bold text-thinklab-black mb-2">Building Type</label>
             <select 
               className="w-full p-3 border border-gray-300 rounded focus:border-thinklab-black focus:ring-0"
               value={formData.type}
               onChange={(e) => setFormData({...formData, type: e.target.value})}
             >
               <option>Residential Duplex</option>
               <option>Commercial Complex</option>
               <option>Warehouse</option>
               <option>Bungalow</option>
               <option>Infrastructure</option>
               <option>High-rise Apartment</option>
             </select>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-thinklab-black mb-2">Land Size</label>
               <input 
                 type="text" 
                 className="w-full p-3 border border-gray-300 rounded focus:border-thinklab-black focus:ring-0"
                 placeholder="e.g. 600sqm"
                 value={formData.landSize}
                 onChange={(e) => setFormData({...formData, landSize: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-sm font-bold text-thinklab-black mb-2">Floors</label>
               <input 
                 type="number" 
                 className="w-full p-3 border border-gray-300 rounded focus:border-thinklab-black focus:ring-0"
                 placeholder="e.g. 2"
                 value={formData.floors}
                 onChange={(e) => setFormData({...formData, floors: e.target.value})}
               />
             </div>
           </div>

           <div>
             <label className="block text-sm font-bold text-thinklab-black mb-2">Estimated Budget (₦)</label>
             <input 
               type="text" 
               className="w-full p-3 border border-gray-300 rounded focus:border-thinklab-black focus:ring-0"
               placeholder="e.g. 50,000,000"
               value={formData.budget}
               onChange={(e) => setFormData({...formData, budget: e.target.value})}
             />
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-thinklab-black text-white py-4 rounded font-bold uppercase tracking-wider hover:bg-gray-800 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2"/> : (
                <>
                   <PlayCircle className="w-5 h-5 mr-2" /> Generate Lifecycle Plan
                </>
             )}
           </button>
        </form>

        {result && (
           <div className="bg-gray-50 p-4 rounded border border-gray-200">
             <h4 className="font-bold text-thinklab-black mb-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-2"/> Workspace Integration
             </h4>
             <button 
                onClick={handleSave}
                disabled={saved}
                className={`w-full py-3 rounded font-bold flex items-center justify-center transition ${saved ? 'bg-green-600 text-white' : 'bg-thinklab-red text-white hover:bg-red-700'}`}
             >
                {saved ? (
                   <>
                     <CheckCircle className="w-5 h-5 mr-2" /> Plan Saved to {activeWorkspace.name}
                   </>
                ) : (
                   <>
                     <Save className="w-5 h-5 mr-2" /> Save Plan to {activeWorkspace.name}
                   </>
                )}
             </button>
           </div>
        )}
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        {loading && (
          <div className="h-full flex flex-col items-center justify-center p-12 bg-gray-50 rounded border border-dashed border-gray-300 text-thinklab-grey">
             <Loader2 className="w-12 h-12 animate-spin mb-4 text-thinklab-red"/>
             <p className="text-center font-medium">Planning Project Phases...</p>
             <p className="text-sm mt-2 opacity-70">Acquisition • Design • Procurement • Execution • Close-out</p>
          </div>
        )}

        {!loading && !result && (
          <div className="h-full flex flex-col items-center justify-center p-12 bg-gray-100 rounded border border-dashed border-gray-300 text-thinklab-grey">
             <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 opacity-50"/>
             </div>
             <p>Ready to generate execution plan.</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-thinklab-black text-white p-4 flex justify-between items-center">
                <h3 className="font-bold">Project Execution Plan</h3>
                <span className="text-xs bg-thinklab-red px-2 py-1 rounded">AI Generated</span>
             </div>
             
             <div className="p-6 space-y-6">
                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded border-l-4 border-thinklab-red">
                   <p className="text-sm text-thinklab-black italic">"{result.summary}"</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                     <div className="flex items-center text-thinklab-grey text-xs uppercase mb-1">
                        <DollarSign className="w-4 h-4 mr-1"/> Est. Cost
                     </div>
                     <p className="text-xl font-bold text-thinklab-black">{result.costEstimate}</p>
                  </div>
                  <div className="p-4 border rounded">
                     <div className="flex items-center text-thinklab-grey text-xs uppercase mb-1">
                        <Clock className="w-4 h-4 mr-1"/> Timeline
                     </div>
                     <p className="text-xl font-bold text-thinklab-black">{result.timeline}</p>
                  </div>
                </div>

                {/* Stages */}
                <div>
                  <h4 className="font-bold text-thinklab-black mb-3 flex items-center uppercase text-xs tracking-wider">
                    <CheckCircle className="w-4 h-4 mr-2 text-thinklab-grey"/> Lifecycle Phases
                  </h4>
                  <div className="space-y-4">
                    {result.stages.map((stage, idx) => (
                      <div key={idx} className="flex flex-col p-3 bg-gray-50 rounded border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                           <span className="font-bold text-sm text-thinklab-black flex items-center">
                              <span className="w-5 h-5 rounded-full bg-thinklab-black text-white flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                              {stage.name}
                           </span>
                           <span className="text-[10px] font-medium bg-white border px-2 py-1 rounded shadow-sm">{stage.duration}</span>
                        </div>
                        <p className="text-xs text-thinklab-grey pl-7">{stage.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                 {/* Materials */}
                <div>
                  <h4 className="font-bold text-thinklab-black mb-3 flex items-center uppercase text-xs tracking-wider">
                    <Hammer className="w-4 h-4 mr-2 text-thinklab-grey"/> Required Resources
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.materials.map((mat, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-thinklab-black px-3 py-1 rounded-full border border-gray-200">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchitectureGenerator;
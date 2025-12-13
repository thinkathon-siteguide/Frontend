import React, { useState, useEffect, useRef } from 'react';
import { generateArchitecturePlan } from '../services/geminiService';
import { GeneratedArchitecture } from '../types';
import { 
  Loader2, 
  CheckCircle, 
  Clock, 
  Hammer, 
  DollarSign, 
  FileText, 
  Save, 
  Briefcase, 
  PlayCircle, 
  ChevronDown, 
  AlertCircle,
  Bot,
  User,
  Send,
  Sparkles,
  ArrowRight,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ArchitectureGenerator: React.FC = () => {
  const { activeWorkspace, saveArchitectureToWorkspace, workspaces, setActiveWorkspace } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedArchitecture | null>(null);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat/Form State
  const [step, setStep] = useState(0); // 0: Start, 1: Typing
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
    setStep(1); // Move to "AI Thinking" state

    try {
        const data = await generateArchitecturePlan(formData.type, formData.landSize, formData.floors, formData.budget);
        setResult(data);
    } catch (error: any) {
        setErrorMsg(error.message || "Failed to generate plan.");
        setStep(0);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [result, loading]);

  if (!activeWorkspace) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
             <Bot className="w-10 h-10 text-thinklab-black"/>
          </div>
          <h2 className="text-3xl font-serif font-bold text-thinklab-black">AI Architecture Studio</h2>
          <p className="text-gray-500 mt-2 mb-8 max-w-md text-lg">
            Select a workspace to start collaborating with our AI architect on your next masterpiece.
          </p>
          
          <div className="w-full max-w-sm relative group">
             <div className="absolute inset-0 bg-thinklab-red/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <select 
                onChange={handleWorkspaceChange}
                className="w-full p-4 border border-gray-200 rounded-xl font-bold text-thinklab-black bg-white focus:ring-2 focus:ring-thinklab-black focus:outline-none cursor-pointer shadow-lg relative z-10 hover:border-thinklab-black transition-colors"
                defaultValue=""
             >
                <option value="" disabled>Choose a Project...</option>
                {workspaces.map(ws => (
                   <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5 z-20" />
          </div>

          <p className="mt-8 text-sm text-gray-400">
             To start a fresh project, <button onClick={() => navigate('/workspaces')} className="text-thinklab-black font-bold hover:underline">create a new workspace</button>
          </p>
       </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 overflow-hidden animate-fade-in">
      
      {/* Left Panel: AI Interaction */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden relative">
         {/* Header */}
         <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-thinklab-black text-white rounded-lg">
                   <Bot className="w-5 h-5" />
               </div>
               <div>
                   <h2 className="font-bold text-thinklab-black">SiteGuard AI</h2>
                   <p className="text-xs text-green-600 flex items-center font-medium">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span> Online
                   </p>
               </div>
            </div>
            
            <div className="relative">
               <select 
                  onChange={handleWorkspaceChange}
                  value={activeWorkspace.id}
                  className="pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-xs font-bold bg-gray-50 text-gray-600 cursor-pointer hover:border-gray-300 focus:outline-none appearance-none transition-colors"
               >
                  {workspaces.map(ws => (
                     <option key={ws.id} value={ws.id}>{ws.name}</option>
                  ))}
               </select>
               <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-3 h-3" />
            </div>
         </div>

         {/* Chat Area */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {/* System Welcome */}
            <div className="flex gap-4 animate-fade-in-up">
                <div className="w-8 h-8 rounded-full bg-thinklab-black flex-shrink-0 flex items-center justify-center text-white mt-1">
                    <Bot size={16} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Hello! I'm your AI architecture assistant. I can help you draft a comprehensive execution plan for <span className="font-bold text-thinklab-black">{activeWorkspace.name}</span>. 
                        Please confirm the details below to get started.
                    </p>
                </div>
            </div>

            {/* AI Form Interface */}
            <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                 <div className="w-8 h-8 rounded-full bg-thinklab-black flex-shrink-0 flex items-center justify-center text-white mt-1">
                    <Bot size={16} />
                </div>
                <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 w-full max-w-[90%]">
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Building Type</label>
                                <select 
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
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
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Budget (₦)</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Land Size</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
                                    value={formData.landSize}
                                    onChange={(e) => setFormData({...formData, landSize: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Floors</label>
                                <input 
                                    type="number" 
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
                                    value={formData.floors}
                                    onChange={(e) => setFormData({...formData, floors: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-thinklab-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-gray-200 mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Sparkles className="w-4 h-4 mr-2 group-hover:text-yellow-400 transition-colors" />}
                            {loading ? 'Analyzing Requirements...' : 'Generate Blueprints'}
                        </button>
                    </form>
                </div>
            </div>

            {loading && (
                <div className="flex gap-4 animate-fade-in-up">
                    <div className="w-8 h-8 rounded-full bg-thinklab-black flex-shrink-0 flex items-center justify-center text-white mt-1">
                        <Bot size={16} />
                    </div>
                     <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-3">
                         <div className="flex gap-1">
                             <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                             <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                             <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                         </div>
                         <span className="text-sm text-gray-500">Processing structural requirements...</span>
                     </div>
                </div>
            )}

            {errorMsg && (
                <div className="flex gap-4 animate-fade-in-up">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex-shrink-0 flex items-center justify-center text-white mt-1">
                        <AlertCircle size={16} />
                    </div>
                    <div className="bg-red-50 p-4 rounded-2xl rounded-tl-none border border-red-100 text-red-700 text-sm">
                        {errorMsg}
                    </div>
                </div>
            )}
            
            <div ref={messagesEndRef} />
         </div>
      </div>

      {/* Right Panel: Visualization */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${result ? 'translate-x-0 opacity-100' : 'translate-x-[20px] opacity-50'}`}>
         {result ? (
            <div className="h-full flex flex-col space-y-4 overflow-y-auto pr-1">
                {/* Visualizer Header */}
                <div className="bg-gradient-to-r from-thinklab-black to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/10 transition-colors"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">AI Generated Plan</span>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-3xl font-serif font-bold mb-2">{activeWorkspace.name} - Concept</h2>
                            <p className="text-gray-300 text-sm max-w-md opacity-90 leading-relaxed">
                                {result.summary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 hover:-translate-y-1 transition duration-300">
                         <div className="flex items-center text-gray-400 text-xs font-bold uppercase mb-2">
                             <DollarSign className="w-4 h-4 mr-1 text-green-500" /> Estimated Cost
                         </div>
                         <p className="text-2xl font-bold text-thinklab-black">{result.costEstimate}</p>
                     </div>
                     <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 hover:-translate-y-1 transition duration-300">
                         <div className="flex items-center text-gray-400 text-xs font-bold uppercase mb-2">
                             <Clock className="w-4 h-4 mr-1 text-blue-500" /> Timeline
                         </div>
                         <p className="text-2xl font-bold text-thinklab-black">{result.timeline}</p>
                     </div>
                </div>

                {/* Lifecycle Phases */}
                {/* Lifecycle Phases */}
                {result && (
                  <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden animate-fade-in-up">
                     <div className="bg-thinklab-black text-white p-4 flex justify-between items-center">
                        <div className="flex items-center">
                             <Briefcase className="w-5 h-5 mr-2 text-thinklab-red" />
                             <h3 className="font-bold text-lg">Execution Lifecycle</h3>
                        </div>
                         <button 
                             onClick={handleSave}
                             disabled={saved}
                             className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition ${saved ? 'bg-green-100 text-green-700' : 'bg-white/10 text-white hover:bg-white/20'}`}
                         >
                             {saved ? <CheckCircle size={14} className="mr-1.5"/> : <Save size={14} className="mr-1.5"/>}
                             {saved ? 'Saved' : 'Save Plan'}
                         </button>
                     </div>
                     
                     <div className="p-6 space-y-6">
                          <div className="space-y-4">
                               {result.stages.map((stage, idx) => (
                                   <div key={idx} className="group flex items-start p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                       <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center mr-4 group-hover:bg-thinklab-red group-hover:text-white transition-colors text-sm">
                                           {idx + 1}
                                       </div>
                                       <div className="flex-1">
                                           <div className="flex justify-between items-center mb-1">
                                               <h4 className="font-bold text-thinklab-black text-sm">{stage.name}</h4>
                                               <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-500">{stage.duration}</span>
                                           </div>
                                           <p className="text-xs text-gray-500 leading-relaxed">{stage.description}</p>
                                       </div>
                                   </div>
                               ))}
                          </div>

                          <div className="mt-8 pt-6 border-t border-gray-100">
                              <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                                   <Hammer className="w-3 h-3 mr-2" /> Recommended Resources
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                  {result.materials.map((mat, idx) => (
                                      <span key={idx} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-gray-300 transition-colors cursor-default">
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
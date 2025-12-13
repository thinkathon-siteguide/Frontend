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
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useWorkspaces } from '../modules/workspace';
import { useArchitecture } from '../modules/architecture';

const ArchitectureGenerator: React.FC = () => {
  const { activeWorkspaceId, setActiveWorkspace } = useApp();
  const { workspaces } = useWorkspaces();
  const { architecture, saveArchitecture, isSaving } =
    useArchitecture(activeWorkspaceId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedArchitecture | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeWorkspace = workspaces?.find(
    (ws) => ws._id === activeWorkspaceId
  );

  const [formData, setFormData] = useState({
    type: activeWorkspace?.type || 'Residential Duplex',
    landSize: '600sqm',
    floors: '2',
    budget: activeWorkspace?.budget || '50000000',
    purpose: 'Family Home',
  });

  useEffect(() => {
    if (activeWorkspace) {
      setFormData((prev) => ({
        ...prev,
        type: activeWorkspace.type || prev.type,
        budget: activeWorkspace.budget || prev.budget,
      }));
    }
  }, [activeWorkspace]);

  useEffect(() => {
    if (architecture) {
      const displayFormat: GeneratedArchitecture = {
        sections: architecture.sections,
        materials: architecture.materials,
        stages: architecture.stages.map((stage) => ({
          name: stage.phase,
          description: stage.tasks?.[0] || '',
          duration: stage.duration,
          phase: stage.phase,
          tasks: stage.tasks,
        })),
        summary: architecture.summary,
        costEstimate: undefined,
        timeline: undefined,
      };
      setResult(displayFormat);
    } else {
      setResult(null);
    }
    setErrorMsg(null);
  }, [architecture]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const data = await generateArchitecturePlan(
        formData.type,
        formData.landSize,
        formData.floors,
        formData.budget
      );
      setResult(data);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      const transformedPlan = {
        sections: result.sections || [
          {
            title: 'Project Overview',
            description: result.summary || 'Generated architecture plan',
          },
        ],
        materials: Array.isArray(result.materials)
          ? result.materials.map((mat) => {
              if (typeof mat === 'string') {
                return {
                  name: mat,
                  quantity: 'As required',
                  specification: 'Standard grade',
                };
              }
              return mat;
            })
          : [],
        stages: result.stages.map((stage) => ({
          phase: stage.name || stage.phase || 'Project Phase',
          duration: stage.duration,
          tasks: stage.tasks || [stage.description || 'Stage activities'],
        })),
        summary: result.summary,
      };

      saveArchitecture(transformedPlan);
    }
  };

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setActiveWorkspace(e.target.value);
      setResult(null);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [result, loading]);

  if (!activeWorkspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in-up">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Bot className="w-10 h-10 text-thinklab-black" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-thinklab-black">
          AI Architecture Studio
        </h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-md text-lg">
          Select a workspace to start collaborating with our AI architect on
          your next masterpiece.
        </p>

        <div className="w-full max-w-sm relative group">
          <div className="absolute inset-0 bg-thinklab-red/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <select
            onChange={handleWorkspaceChange}
            className="w-full p-4 border border-gray-200 rounded-xl font-bold text-thinklab-black bg-white focus:ring-2 focus:ring-thinklab-black focus:outline-none cursor-pointer shadow-lg relative z-10 hover:border-thinklab-black transition-colors"
            defaultValue=""
          >
            <option value="" disabled>
              Choose a Project...
            </option>
            {workspaces?.map((ws) => (
              <option key={ws._id} value={ws._id}>
                {ws.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5 z-20" />
        </div>

        <p className="mt-8 text-sm text-gray-400">
          To start a fresh project,{' '}
          <button
            onClick={() => navigate('/workspaces')}
            className="text-thinklab-black font-bold hover:underline"
          >
            create a new workspace
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-thinklab-black">
              AI Architecture Studio
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Generate comprehensive project plans with AI
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <select
              onChange={handleWorkspaceChange}
              value={activeWorkspaceId || ''}
              className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm font-bold bg-white text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-thinklab-black appearance-none transition-colors"
            >
              {workspaces?.map((ws) => (
                <option key={ws._id} value={ws._id}>
                  {ws.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: AI Interaction */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100">
            {/* AI Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r  from-thinklab-black to-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white">
                    SiteGuard AI Assistant
                  </h2>
                  <p className="text-xs text-green-400 flex items-center font-medium">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    Online & Ready
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50/50 max-h-[600px] overflow-y-auto">
              {/* System Welcome */}
              <div className="flex gap-4 animate-fade-in-up">
                <div className="w-8 h-8 rounded-full bg-thinklab-black flex-shrink-0 flex items-center justify-center text-white mt-1">
                  <Bot size={16} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Hello! I'm your AI architecture assistant. I can help you
                    draft a comprehensive execution plan for{' '}
                    <span className="font-bold text-thinklab-black">
                      {activeWorkspace.name}
                    </span>
                    . Please confirm the details below to get started.
                  </p>
                </div>
              </div>

              {/* AI Form Interface */}
              <div
                className="flex gap-4 animate-fade-in-up"
                style={{ animationDelay: '100ms' }}
              >
                <div className="w-8 h-8 rounded-full bg-thinklab-black flex-shrink-0 flex items-center justify-center text-white mt-1">
                  <Bot size={16} />
                </div>
                <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 w-full max-w-[90%]">
                  <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Building Type
                        </label>
                        <select
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
                          value={formData.type}
                          onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                          }
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
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Budget (₦)
                        </label>
                        <input
                          type="text"
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
                          value={formData.budget}
                          onChange={(e) =>
                            setFormData({ ...formData, budget: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Land Size
                        </label>
                        <input
                          type="text"
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
                          value={formData.landSize}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              landSize: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Floors
                        </label>
                        <input
                          type="number"
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-thinklab-black focus:ring-1 focus:ring-thinklab-black outline-none transition-all"
                          value={formData.floors}
                          onChange={(e) =>
                            setFormData({ ...formData, floors: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-thinklab-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-gray-200 mt-2"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2 group-hover:text-yellow-400 transition-colors" />
                      )}
                      {loading
                        ? 'Analyzing Requirements...'
                        : 'Generate Blueprints'}
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
                    <span className="text-sm text-gray-500">
                      Processing structural requirements...
                    </span>
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
          <div
            className={`flex flex-col transition-all duration-500 ${
              result ? 'opacity-100' : 'opacity-40'
            }`}
          >
            {result ? (
              <div className="flex flex-col space-y-4 sm:space-y-6">
                {/* Visualizer Header */}
                <div className="bg-gradient-to-r from-thinklab-black to-gray-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/10 transition-colors"></div>
                  <div className="relative z-10 flex flex-col space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 inline-flex items-center gap-2 w-fit">
                        <Sparkles className="w-3 h-3" />
                        AI Generated Plan
                      </span>
                      <button
                        className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition w-fit"
                        title="Download Plan"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
                        {activeWorkspace.name}
                      </h2>
                      <p className="text-gray-300 text-sm leading-relaxed opacity-90">
                        {result.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics Cards */}
                {(result.costEstimate || result.timeline) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {result.costEstimate && (
                      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-soft border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center text-gray-500 text-xs font-bold uppercase mb-2">
                          <DollarSign className="w-4 h-4 mr-1.5 text-green-500" />
                          Estimated Cost
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-thinklab-black">
                          {result.costEstimate}
                        </p>
                      </div>
                    )}
                    {result.timeline && (
                      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-soft border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center text-gray-500 text-xs font-bold uppercase mb-2">
                          <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
                          Timeline
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-thinklab-black">
                          {result.timeline}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Lifecycle Phases */}
                {result && (
                  <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                    <div className="bg-thinklab-black text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-thinklab-red flex-shrink-0" />
                        <h3 className="font-bold text-base sm:text-lg">
                          Execution Lifecycle
                        </h3>
                      </div>
                      <button
                        onClick={handleSave}
                        disabled={isSaving || !!architecture}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                          architecture
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                        } ${isSaving ? 'opacity-75' : ''}`}
                      >
                        {isSaving ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : architecture ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Save size={16} />
                        )}
                        <span className="hidden sm:inline">
                          {isSaving
                            ? 'Saving...'
                            : architecture
                            ? 'Saved'
                            : 'Save Plan'}
                        </span>
                        <span className="sm:hidden">
                          {isSaving
                            ? 'Saving'
                            : architecture
                            ? 'Saved'
                            : 'Save'}
                        </span>
                      </button>
                    </div>

                    <div className="p-4 sm:p-6 space-y-6">
                      <div className="space-y-3 sm:space-y-4">
                        {result.stages.map((stage, idx) => (
                          <div
                            key={idx}
                            className="group flex items-start p-3 sm:p-4 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-200"
                          >
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-thinklab-red group-hover:text-white transition-all text-xs sm:text-sm flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-2">
                                <h4 className="font-bold text-thinklab-black text-sm sm:text-base">
                                  {stage.name}
                                </h4>
                                <span className="text-[10px] sm:text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 w-fit whitespace-nowrap">
                                  {stage.duration}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                {stage.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-3 sm:mb-4 flex items-center">
                          <Hammer className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                          Recommended Resources
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.materials.map((mat, idx) => {
                            const displayText =
                              typeof mat === 'string'
                                ? mat
                                : `${mat.name} - ${mat.quantity}`;
                            return (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-100 transition-colors cursor-default"
                              >
                                {displayText}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 sm:p-16 flex items-center justify-center min-h-[400px]">
                <div className="text-center opacity-50">
                  <Bot className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-400 font-bold text-base sm:text-lg">
                    Waiting for AI generation...
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Fill in the form and click "Generate Blueprints"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureGenerator;

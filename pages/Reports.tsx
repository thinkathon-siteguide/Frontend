import React, { useState } from 'react';
import { FileText, Download, Printer, Share2, Briefcase, ChevronDown, Loader2, Calendar, AlertTriangle, CheckCircle, BrainCircuit, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateProjectReport } from '../services/geminiService';
import { GeneratedReport } from '../types';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Reports: React.FC = () => {
  const { workspaces, activeWorkspace, setActiveWorkspace } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveWorkspace(e.target.value);
    setReport(null);
    setErrorMsg(null);
  };

  const handleGenerateReport = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await generateProjectReport(activeWorkspace);
      setReport(data);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to generate daily report.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert("Report downloaded as PDF (Demo)");
  };

  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
         <FileText className="w-16 h-16 text-gray-200 mb-4" />
         <h2 className="text-xl font-bold text-thinklab-black">No Projects Available</h2>
         <p className="text-thinklab-grey mt-2 mb-6">Create a workspace to start generating reports.</p>
         <button onClick={() => navigate('/workspaces')} className="text-thinklab-red font-bold hover:underline">
            Go to Workspaces
         </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-thinklab-black">Daily Site Reports</h2>
           <p className="text-thinklab-grey mt-1">Generate AI-driven progress summaries for stakeholders.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           {/* Workspace Selector */}
           <div className="relative w-full sm:w-64">
                <select
                  onChange={handleWorkspaceChange}
                  value={activeWorkspace?.id || ''}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded font-bold text-thinklab-black bg-white focus:outline-none focus:border-thinklab-black appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Project...</option>
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name}</option>
                  ))}
                </select>
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
           </div>

           <button 
             onClick={handleGenerateReport}
             disabled={!activeWorkspace || loading}
             className={`px-6 py-3 rounded font-bold text-white flex items-center justify-center shadow-lg transition ${!activeWorkspace || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-thinklab-black hover:bg-gray-800'}`}
           >
             {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2"/> : <BrainCircuit className="w-5 h-5 mr-2"/>}
             Generate Report
           </button>
        </div>
      </div>

      {!activeWorkspace && (
         <div className="p-12 text-center bg-white rounded border border-dashed border-gray-300 text-thinklab-grey">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a workspace above to view or generate reports.</p>
         </div>
      )}

      {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start">
             <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
             <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

      {/* Report Preview */}
      {activeWorkspace && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Report Document */}
           <div className="lg:col-span-2 bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden min-h-[600px] flex flex-col">
              {/* Document Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-8">
                 <div className="flex justify-between items-start">
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                          <Logo className="w-8 h-8" />
                          <span className="font-bold text-xl text-thinklab-black tracking-wide">ThinkLab Group</span>
                       </div>
                       <h1 className="text-3xl font-bold font-serif text-thinklab-black mt-4">DAILY SITE REPORT</h1>
                       <p className="text-thinklab-grey mt-1 uppercase tracking-widest text-xs">Internal Use Only</p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-thinklab-black">{activeWorkspace.name}</p>
                       <p className="text-sm text-thinklab-grey">{activeWorkspace.location}</p>
                       <div className="flex items-center justify-end mt-2 text-sm text-thinklab-grey">
                          <Calendar className="w-4 h-4 mr-1" />
                          {report ? report.date : new Date().toLocaleDateString()}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Document Content */}
              <div className="p-8 flex-1 space-y-8">
                 {!report && !loading && !errorMsg && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                       <FileText className="w-16 h-16 mb-4" />
                       <p>Click "Generate Report" to create a summary.</p>
                    </div>
                 )}

                 {loading && (
                    <div className="h-full flex flex-col items-center justify-center text-thinklab-grey">
                       <Loader2 className="w-12 h-12 animate-spin mb-4 text-thinklab-red" />
                       <p>Analyzing project data...</p>
                    </div>
                 )}

                 {report && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                       <section>
                          <h3 className="font-bold text-thinklab-black border-b-2 border-thinklab-red pb-1 mb-3 uppercase text-sm tracking-wider">Executive Summary</h3>
                          <p className="text-gray-700 leading-relaxed text-sm">
                             {report.executiveSummary}
                          </p>
                       </section>

                       <section>
                          <h3 className="font-bold text-thinklab-black border-b-2 border-gray-200 pb-1 mb-3 uppercase text-sm tracking-wider">Progress Update - {activeWorkspace.stage}</h3>
                          <p className="text-gray-700 leading-relaxed text-sm">
                             {report.progressUpdate}
                          </p>
                       </section>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <section>
                             <h3 className="font-bold text-thinklab-black border-b-2 border-gray-200 pb-1 mb-3 uppercase text-sm tracking-wider flex items-center text-thinklab-red">
                                <AlertTriangle className="w-4 h-4 mr-2" /> Key Issues & Risks
                             </h3>
                             <ul className="list-disc list-inside space-y-2">
                                {report.keyIssues.length > 0 ? report.keyIssues.map((issue, idx) => (
                                   <li key={idx} className="text-sm text-gray-700">{issue}</li>
                                )) : <li className="text-sm text-gray-500 italic">No major issues reported.</li>}
                             </ul>
                          </section>

                          <section>
                             <h3 className="font-bold text-thinklab-black border-b-2 border-gray-200 pb-1 mb-3 uppercase text-sm tracking-wider flex items-center text-green-700">
                                <CheckCircle className="w-4 h-4 mr-2" /> Recommendations
                             </h3>
                             <ul className="list-disc list-inside space-y-2">
                                {report.recommendations.map((rec, idx) => (
                                   <li key={idx} className="text-sm text-gray-700">{rec}</li>
                                ))}
                             </ul>
                          </section>
                       </div>
                    </div>
                 )}
              </div>

              {/* Document Footer */}
              <div className="bg-gray-50 border-t border-gray-200 p-4 text-center text-xs text-gray-400">
                 Generated by BuildAI Workspace • {new Date().getFullYear()} ThinkLab Group
              </div>
           </div>

           {/* Sidebar Actions */}
           <div className="space-y-6">
              <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
                 <h3 className="font-bold text-thinklab-black mb-4">Export Options</h3>
                 <div className="space-y-3">
                    <button 
                       onClick={handleExport}
                       disabled={!report} 
                       className="w-full py-3 border border-gray-300 rounded font-bold text-thinklab-black hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
                    >
                       <Printer className="w-4 h-4 mr-2" /> Print / PDF
                    </button>
                    <button 
                       onClick={handleExport}
                       disabled={!report} 
                       className="w-full py-3 border border-gray-300 rounded font-bold text-thinklab-black hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
                    >
                       <Download className="w-4 h-4 mr-2" /> Download CSV
                    </button>
                    <button 
                       disabled={!report} 
                       className="w-full py-3 bg-thinklab-red text-white rounded font-bold hover:bg-red-700 flex items-center justify-center disabled:opacity-50"
                    >
                       <Share2 className="w-4 h-4 mr-2" /> Share with Manager
                    </button>
                 </div>
              </div>

              <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
                 <h3 className="font-bold text-thinklab-black mb-4">Quick Stats</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-thinklab-grey">Completion</span>
                       <span className="font-bold text-thinklab-black">{activeWorkspace.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                       <div className="bg-thinklab-black h-2 rounded-full" style={{width: `${activeWorkspace.progress}%`}}></div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                       <span className="text-sm text-thinklab-grey">Safety Score</span>
                       <span className={`font-bold ${activeWorkspace.safetyScore < 80 ? 'text-thinklab-red' : 'text-green-600'}`}>
                          {activeWorkspace.safetyScore}/100
                       </span>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                       <span className="text-sm text-thinklab-grey block mb-2">Critical Stock</span>
                       <div className="flex flex-wrap gap-2">
                          {activeWorkspace.resources.filter(r => r.status === 'Critical').length > 0 ? (
                             activeWorkspace.resources.filter(r => r.status === 'Critical').map(r => (
                                <span key={r.id} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">{r.name}</span>
                             ))
                          ) : (
                             <span className="text-xs text-green-600 italic">No critical items</span>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
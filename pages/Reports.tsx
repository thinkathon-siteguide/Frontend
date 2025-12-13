import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Share2,
  Briefcase,
  ChevronDown,
  Loader2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  BrainCircuit,
  AlertCircle,
  Edit3,
  Settings,
  MoreVertical,
  PieChart,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateProjectReport } from '../services/geminiService';
import { GeneratedReport } from '../types';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useWorkspaces } from '../modules/workspace/hooks/useWorkspaces';
import { toast } from 'react-hot-toast';

const Reports: React.FC = () => {
  const { activeWorkspaceId, setActiveWorkspace } = useApp();
  const { workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [animateText, setAnimateText] = useState(false);

  const activeWorkspace = workspaces.find((w) => w._id === activeWorkspaceId);

  // Reset animation when report changes
  useEffect(() => {
    if (report) {
      setAnimateText(true);
      const timer = setTimeout(() => setAnimateText(false), 2000); // Stop typing effect after 2s
      return () => clearTimeout(timer);
    }
  }, [report]);

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveWorkspace(e.target.value);
    setReport(null);
    setErrorMsg(null);
  };

  const handleGenerateReport = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    setErrorMsg(null);
    setReport(null);
    try {
      const workspaceForReport = {
        ...activeWorkspace,
        id: activeWorkspace._id,
      };
      const data = await generateProjectReport(workspaceForReport as any);
      setReport(data);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to generate daily report.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!report || !activeWorkspace) {
      toast.error('No report to export');
      return;
    }

    const printContent = document.getElementById('printable-report');
    if (!printContent) return;

    const originalTitle = document.title;
    document.title = `${activeWorkspace.name}_Report_${new Date().toISOString().split('T')[0]}`;

    window.print();

    document.title = originalTitle;
  };

  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 animate-fade-in-up">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-thinklab-black">
          Report Builder
        </h2>
        <p className="text-thinklab-grey mt-2 mb-8 max-w-md">
          No projects found. Create a workspace to start generating automated AI
          progress reports.
        </p>
        <button
          onClick={() => navigate('/workspaces')}
          className="px-8 py-3 bg-thinklab-red text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg hover:shadow-xl"
        >
          Create Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 animate-fade-in overflow-hidden">
      {/* Left Panel: Control Rail */}
      <div className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0 bg-white p-6 rounded-3xl shadow-soft border border-gray-100 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-thinklab-black mb-1">
            Report Builder
          </h2>
          <p className="text-xs text-gray-400">Daily Progress & Safety Logs</p>
        </div>

        {/* Project Selector */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
              Select Project
            </label>
            <div className="relative">
              <select
                onChange={handleWorkspaceChange}
                value={activeWorkspaceId || ''}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-bold text-thinklab-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-thinklab-black focus:bg-white transition-all appearance-none cursor-pointer text-sm"
              >
                <option value="" disabled>
                  Choose Project...
                </option>
                {workspaces.map((ws) => (
                  <option key={ws._id} value={ws._id}>
                    {ws.name}
                  </option>
                ))}
              </select>
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {activeWorkspace && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status</span>
                <span className="font-bold text-thinklab-black px-2 py-0.5 bg-white border border-gray-200 rounded text-xs">
                  {activeWorkspace.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Stage</span>
                <span className="font-bold text-thinklab-black text-right truncate max-w-[120px]">
                  {activeWorkspace.stage}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 my-2"></div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleGenerateReport}
            disabled={!activeWorkspace || loading}
            className="w-full py-4 bg-thinklab-black text-white rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 mr-2 relative z-10" />
            ) : (
              <BrainCircuit className="w-5 h-5 mr-2 relative z-10 group-hover:text-yellow-300 transition-colors" />
            )}
            <span className="relative z-10">
              {loading ? 'Generating...' : 'Generate New Report'}
            </span>
          </button>

           <button
             disabled={!report}
             onClick={handleExport}
             className="w-full py-3 border border-gray-200 text-thinklab-black rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <Printer className="w-4 h-4 mr-2" /> Print / Save as PDF
           </button>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 p-4 rounded-xl text-xs text-red-700 leading-relaxed border border-red-100 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">Error</span>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Tips */}
        {!report && activeWorkspace && !errorMsg && (
          <div className="mt-auto bg-blue-50 p-4 rounded-xl text-xs text-blue-700 leading-relaxed border border-blue-100">
            <span className="font-bold block mb-1">✨ Pro Tip</span>
            Generate a report at the end of each work day to maintain a
            comprehensive audit trail for your client.
          </div>
        )}
      </div>

      {/* Center Panel: Report Preview */}
      <div className="flex-1 overflow-y-auto bg-gray-100/50 rounded-3xl p-4 lg:p-8 flex justify-center items-start shadow-inner border border-gray-200/50 scrollbar-hide">
        {!activeWorkspace ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 opacity-60">
            <Briefcase className="w-16 h-16 mb-4" />
            <p className="font-bold">Select a project to begin</p>
          </div>
        ) : !report && !loading ? (
          <div className="flex flex-col items-center justify-center h-full max-w-md text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 animate-float">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-thinklab-black">
              Ready to Report
            </h3>
            <p className="text-gray-400 mt-2 mb-8">
              Our AI will analyze your project's inventory, safety logs, and
              timeline to draft a complete daily summary.
            </p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-20 h-24 bg-white shadow-xl rounded mx-auto mb-8 animate-pulse flex flex-col p-2 gap-2">
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-5/6"></div>
              <div className="h-2 bg-gray-200 rounded w-full mt-4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
            <p className="text-thinklab-grey font-medium animate-pulse">
              Drafting report content...
            </p>
          </div>
         ) : report ? (
           <div
             id="printable-report"
             className="bg-white w-full max-w-[800px] shadow-2xl min-h-[1000px] p-8 md:p-12 relative animate-fade-in-up print:shadow-none print:max-w-full"
           >
             {/* Paper Texture/Effect */}
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-gray-100 to-transparent opacity-50 print:hidden"></div>

            {/* Document Header */}
            <header className="flex justify-between items-start border-b-2 border-thinklab-black pb-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Logo className="w-8 h-8" />
                  <span className="font-bold text-lg tracking-tight">
                    ThinkLab Group
                  </span>
                </div>
                <h1 className="text-4xl font-serif font-bold text-thinklab-black mb-2">
                  DAILY SITE REPORT
                </h1>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>Internal Document</span>
                  <span>•</span>
                  <span>Confidential</span>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <div className="text-xs text-gray-400 uppercase font-bold">
                    Date
                  </div>
                  <div className="font-serif font-bold text-lg">
                    {report.date}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold">
                    Project Ref
                  </div>
                  <div className="font-mono text-sm">
                    {activeWorkspace._id.substring(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>
            </header>

            {/* Content Body */}
            <div className="space-y-8 font-serif">
              <section>
                <h3 className="text-xs font-bold font-sans uppercase tracking-widest text-thinklab-red mb-3 flex items-center gap-2">
                  <div className="w-8 h-[2px] bg-thinklab-red"></div> Executive
                  Summary
                </h3>
                <p
                  className={`text-gray-800 leading-relaxed text-justify ${
                    animateText ? 'animate-pulse' : ''
                  }`}
                >
                  {report.executiveSummary}
                </p>
              </section>

              <div className="grid grid-cols-2 gap-8 py-4 border-y border-gray-100 my-6 bg-gray-50/50 p-6 rounded-lg font-sans">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">
                    Project Name
                  </span>
                  <span className="font-bold text-thinklab-black block">
                    {activeWorkspace.name}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">
                    Location
                  </span>
                  <span className="font-bold text-thinklab-black block">
                    {activeWorkspace.location}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">
                    Supervisor
                  </span>
                  <span className="font-bold text-thinklab-black block">
                    Farouq Oduola
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">
                    Weather Conditions
                  </span>
                  <span className="font-bold text-thinklab-black block">
                    Sunny, 28°C
                  </span>
                </div>
              </div>

              <section>
                <h3 className="text-xs font-bold font-sans uppercase tracking-widest text-thinklab-black mb-3 border-b border-gray-200 pb-2">
                  Progress Update
                </h3>
                <p className="text-gray-800 leading-relaxed text-sm">
                  {report.progressUpdate}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h3 className="text-xs font-bold font-sans uppercase tracking-widest text-gray-500 mb-4 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" /> Key Issues
                  </h3>
                  <ul className="space-y-3">
                    {report.keyIssues.length > 0 ? (
                      report.keyIssues.map((issue, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-sm text-gray-700 bg-red-50 p-3 rounded border-l-2 border-red-200"
                        >
                          <span className="font-bold mr-2 text-red-500">
                            {idx + 1}.
                          </span>{' '}
                          {issue}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-400 italic">
                        No significant issues logged today.
                      </li>
                    )}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xs font-bold font-sans uppercase tracking-widest text-gray-500 mb-4 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" /> Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {report.recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-gray-700 bg-green-50 p-3 rounded border-l-2 border-green-200"
                      >
                        <span className="font-bold mr-2 text-green-600">✓</span>{' '}
                        {rec}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 pt-8 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400 font-sans">
              <div>Generating via BuildAI Intelligence Engine</div>
              <div className="flex gap-4">
                <span>Page 1 of 1</span>
              </div>
            </footer>
          </div>
        ) : null}
      </div>

      {/* Right Panel: Context Widgets */}
      <div className="w-full lg:w-72 hidden xl:flex flex-col gap-6 flex-shrink-0">
        {activeWorkspace && (
          <>
            {/* Budget Widget */}
            <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-thinklab-black text-sm">
                  Budget Burn
                </h4>
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-thinklab-black mb-1">
                ₦{parseInt(activeWorkspace.budget).toLocaleString()}
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 mb-2">
                <div
                  className="bg-thinklab-black h-1.5 rounded-full"
                  style={{ width: '65%' }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">65% utilized this month</p>
            </div>

            {/* Safety Widget */}
            <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-thinklab-red/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-thinklab-red/10 transition-colors"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h4 className="font-bold text-thinklab-black text-sm">
                  Safety Score
                </h4>
                <ShieldIcon score={activeWorkspace.safetyScore} />
              </div>
              <div className="text-4xl font-bold text-thinklab-black mb-1 relative z-10">
                {activeWorkspace.safetyScore}
              </div>
              <p className="text-xs text-gray-400 relative z-10">
                Based on last 7 days
              </p>
            </div>

            {/* Progress Widget */}
            <div className="bg-thinklab-black rounded-2xl p-5 shadow-soft text-white">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm">Overall Progress</h4>
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">
                  {activeWorkspace.progress}%
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i * 20 <= activeWorkspace.progress
                        ? 'bg-yellow-400'
                        : 'bg-gray-700'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ShieldIcon = ({ score }: { score: number }) => {
  if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-500" />;
  return <AlertCircle className="w-4 h-4 text-thinklab-red" />;
};

export default Reports;

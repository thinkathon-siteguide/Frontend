import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  ShieldAlert,
  CheckCircle,
  AlertOctagon,
  Save,
  List,
  X,
  Aperture,
  RefreshCw,
  AlertCircle,
  Scan,
  History,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { analyzeSafetyImage } from '../services/geminiService';
import { SafetyReport } from '../types';
import { useApp } from '../context/AppContext';
import { useWorkspaces } from '../modules/workspace/hooks/useWorkspaces';
import {
  useSafetyReports,
  useSaveSafetyReport,
} from '../modules/workspace/hooks/useSafetyReports';

const SafetyMonitor: React.FC = () => {
  const { activeWorkspaceId } = useApp();
  const { workspaces } = useWorkspaces();
  const { data: safetyReports = [] } = useSafetyReports(activeWorkspaceId);
  const saveSafetyReportMutation = useSaveSafetyReport();

  const activeWorkspace = workspaces.find((w) => w._id === activeWorkspaceId);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<SafetyReport | null>(null);
  const [viewHistory, setViewHistory] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setImage(null);
      setReport(null);
      setErrorMsg(null);
      setIsCameraOpen(true);

      let stream;
      try {
        // Attempt 1: Prefer environment (back) camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
      } catch (err) {
        console.warn(
          'Environment camera failed, falling back to default...',
          err
        );
        try {
          // Attempt 2: Fallback to any available video source
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        } catch (fallbackErr) {
          throw new Error(
            'Unable to access camera. Please check permissions or try uploading a file.'
          );
        }
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera Error:', err);
      setIsCameraOpen(false);
      setErrorMsg(err.message || 'Camera access failed');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
        setViewHistory(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setReport(null);
        setViewHistory(false);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runSafetyCheck = async () => {
    if (!image) return;
    setAnalyzing(true);
    setErrorMsg(null);
    try {
      const base64Data = image.split(',')[1];
      const result = await analyzeSafetyImage(base64Data);
      setReport(result);
    } catch (error: any) {
      setErrorMsg(error.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveReport = () => {
    if (activeWorkspaceId && report) {
      saveSafetyReportMutation.mutate(
        {
          workspaceId: activeWorkspaceId,
          reportData: {
            riskScore: report.riskScore,
            hazards: report.hazards,
            summary: report.summary,
          },
        },
        {
          onSuccess: () => {
            setImage(null);
            setReport(null);
            setViewHistory(true);
          },
        }
      );
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 animate-fade-in overflow-hidden">
      {/* Left Panel: The Scanner */}
      <div className="flex-1 flex flex-col bg-thinklab-black rounded-3xl overflow-hidden relative shadow-2xl group">
        {/* Scanner Overlay UI */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Corner Brackets */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg"></div>

          {/* Scanning Animation */}
          {(isCameraOpen || analyzing) && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-thinklab-red/10 to-transparent animate-scan"></div>
          )}

          {/* Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
          {viewHistory ? (
            <div className="absolute inset-0 bg-white z-30 flex flex-col">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-thinklab-black flex items-center">
                  <History className="w-5 h-5 mr-2 text-thinklab-grey" /> Safety
                  Log History
                </h3>
                <button
                  onClick={() => setViewHistory(false)}
                  className="p-2 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {safetyReports.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    No history available.
                  </div>
                )}
                {safetyReports.map((r, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-default group/item"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-thinklab-grey">
                          {r.date}
                        </span>
                        <p className="font-bold text-thinklab-black mt-1 line-clamp-1">
                          {r.summary}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded font-bold text-white ${
                          r.riskScore > 50 ? 'bg-thinklab-red' : 'bg-green-500'
                        }`}
                      >
                        {r.riskScore}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {r.hazards.slice(0, 3).map((h, hi) => (
                        <span
                          key={hi}
                          className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200"
                        >
                          {h.description}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isCameraOpen ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center items-center gap-8">
                <button
                  onClick={stopCamera}
                  className="bg-black/50 backdrop-blur text-white p-4 rounded-full hover:bg-black/70 transition"
                >
                  <X className="w-6 h-6" />
                </button>
                <button
                  onClick={capturePhoto}
                  className="bg-white border-4 border-gray-800 rounded-full w-20 h-20 flex items-center justify-center hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  <div className="w-16 h-16 bg-thinklab-red rounded-full border-2 border-white"></div>
                </button>
              </div>
            </div>
          ) : image ? (
            <div className="relative w-full h-full group/preview">
              <img
                src={image}
                alt="Site preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black transition opacity-0 group-hover/preview:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>
              {analyzing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                  <div className="w-16 h-16 border-4 border-thinklab-red border-t-white rounded-full animate-spin mb-4"></div>
                  <p className="text-white font-bold tracking-widest animate-pulse">
                    ANALYZING HAZARDS...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 z-30">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                <Scan className="w-10 h-10 text-white/80" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Site Scanner
              </h3>
              <p className="text-white/50 text-sm mb-8 max-w-xs mx-auto">
                Activate the AI vision system to detect safety hazards and PPE
                violations in real-time.
              </p>

              <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                <button
                  onClick={startCamera}
                  className="px-6 py-4 bg-thinklab-red text-white rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center shadow-lg shadow-red-900/20 group/btn"
                >
                  <Aperture className="w-5 h-5 mr-3 group-hover/btn:rotate-90 transition-transform" />
                  Initiate Scan
                </button>

                <div className="relative">
                  <button className="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-xl font-bold text-white hover:bg-white/20 transition flex items-center justify-center backdrop-blur-sm">
                    <Upload className="w-5 h-5 mr-3" />
                    Upload Evidence
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {activeWorkspace && (
                  <button
                    onClick={() => setViewHistory(true)}
                    className="mt-4 text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <History className="w-3 h-3" /> View Log History
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: The Report */}
      <div className="w-full lg:w-[500px] flex flex-col bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
        {/* Live Header */}
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-bold text-thinklab-black text-lg">
              Analysis Report
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>{' '}
              Live System
            </div>
          </div>
          <p className="text-xs text-gray-400">
            {activeWorkspace?.name || 'No Active Workspace'}
          </p>
        </div>

        {!report ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/50">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 transform rotate-3">
              <ShieldAlert className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-400">
              Waiting for Input
            </h3>
            <p className="text-gray-400 text-sm mt-2 max-w-[200px]">
              Capture or upload an image to generate a safety audit.
            </p>

            {image && !analyzing && (
              <button
                onClick={runSafetyCheck}
                className="mt-8 px-8 py-3 bg-thinklab-black text-white rounded-xl font-bold hover:bg-gray-800 transition flex items-center shadow-lg animate-fade-in-up"
              >
                <Zap className="w-4 h-4 mr-2 text-yellow-400 fill-current" />{' '}
                Run Diagnostics
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fade-in-up">
            {/* Safety Score Card */}
            <div className="bg-thinklab-black text-white rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Site Safety Score
                  </p>
                  <h3 className="text-4xl font-bold">
                    {report.riskScore}
                    <span className="text-lg text-gray-500 font-normal">
                      /100
                    </span>
                  </h3>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    report.riskScore > 50
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {report.riskScore > 50 ? <AlertOctagon /> : <CheckCircle />}
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-1000 ${
                    report.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      100 - report.riskScore + (report.riskScore > 50 ? 0 : 20)
                    )}%`,
                  }} // Inverse logic for visual flair (high score = safe)
                ></div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm leading-relaxed text-gray-600">
              <span className="font-bold text-thinklab-black block mb-2">
                AI Summary:
              </span>
              {report.summary}
            </div>

            {/* Hazard List */}
            <div>
              <h4 className="font-bold text-thinklab-black mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-thinklab-red" /> Detected
                Hazards
              </h4>
              <div className="space-y-3">
                {report.hazards.length === 0 && (
                  <div className="p-4 border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm">
                    Safe site conditions detected.
                  </div>
                )}
                {report.hazards.map((hazard, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-gray-100 rounded-xl bg-white hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-bold text-thinklab-black text-sm">
                        {hazard.description}
                      </h5>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          hazard.severity === 'High'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {hazard.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {hazard.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            {activeWorkspace && (
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => {
                    setImage(null);
                    setReport(null);
                  }}
                  className="py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveReport}
                  className="py-3 bg-thinklab-black text-white rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" /> Save to Log
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyMonitor;

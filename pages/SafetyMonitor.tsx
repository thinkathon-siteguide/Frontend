import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, ShieldAlert, CheckCircle, AlertOctagon, Save, List, X, Aperture, RefreshCw, AlertCircle } from 'lucide-react';
import { analyzeSafetyImage } from '../services/geminiService';
import { SafetyReport } from '../types';
import { useApp } from '../context/AppContext';

const SafetyMonitor: React.FC = () => {
  const { activeWorkspace, saveSafetyReportToWorkspace } = useApp();
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
          video: { facingMode: 'environment' } 
        });
      } catch (err) {
        console.warn("Environment camera failed, falling back to default...", err);
        try {
          // Attempt 2: Fallback to any available video source
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: true 
          });
        } catch (fallbackErr) {
          throw new Error("Unable to access camera. Please check permissions or try uploading a file.");
        }
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera Error:", err);
      setIsCameraOpen(false);
      setErrorMsg(err.message || "Camera access failed");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
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
      setErrorMsg(error.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveReport = () => {
    if (activeWorkspace && report) {
       saveSafetyReportToWorkspace(activeWorkspace.id, report);
       setImage(null);
       setReport(null);
       setViewHistory(true); // Switch to history view after saving
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Control Section */}
      <div className="space-y-6">
        <div>
           <h2 className="text-2xl font-bold text-thinklab-black">Site Safety Monitor</h2>
           <p className="text-thinklab-grey mt-1">
              {activeWorkspace 
                ? `Safety logs for ${activeWorkspace.name}` 
                : "Capture or upload site photos to detect hazards and PPE violations."}
           </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start">
             <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
             <div>
                <p className="font-bold">Error Occurred</p>
                <p className="text-sm">{errorMsg}</p>
             </div>
          </div>
        )}

        {activeWorkspace && (
           <div className="flex gap-2">
             <button 
               onClick={() => setViewHistory(false)}
               className={`px-4 py-2 text-sm font-bold rounded ${!viewHistory ? 'bg-thinklab-black text-white' : 'bg-gray-100 text-thinklab-grey'}`}
             >
               New Analysis
             </button>
             <button 
               onClick={() => setViewHistory(true)}
               className={`px-4 py-2 text-sm font-bold rounded ${viewHistory ? 'bg-thinklab-black text-white' : 'bg-gray-100 text-thinklab-grey'}`}
             >
               View Logs ({activeWorkspace.safetyReports?.length || 0})
             </button>
           </div>
        )}

        {(!viewHistory || !activeWorkspace) && (
          <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
             {/* Media Area */}
             <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 relative overflow-hidden h-96 flex flex-col justify-center items-center group">
                {isCameraOpen ? (
                  <div className="relative w-full h-full bg-black">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Camera Controls Overlay */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8">
                       <button 
                         onClick={stopCamera}
                         className="bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/30 transition"
                         title="Cancel"
                       >
                         <X className="w-6 h-6" />
                       </button>
                       <button 
                         onClick={capturePhoto}
                         className="bg-white border-4 border-gray-300 rounded-full w-16 h-16 flex items-center justify-center hover:scale-105 transition shadow-lg"
                         title="Take Photo"
                       >
                         <div className="w-12 h-12 bg-thinklab-red rounded-full"></div>
                       </button>
                       <div className="w-12"></div> {/* Spacer for balance */}
                    </div>
                  </div>
                ) : image ? (
                  <div className="relative w-full h-full">
                    <img src={image} alt="Site preview" className="absolute inset-0 w-full h-full object-cover" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-thinklab-red"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Camera className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-thinklab-black mb-2">Add Site Photo</h3>
                    <p className="text-thinklab-grey text-sm mb-6 max-w-xs mx-auto">
                      Take a live photo or upload an existing image for AI hazard detection.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md mx-auto">
                        <button 
                          onClick={startCamera}
                          className="px-6 py-3 bg-thinklab-black text-white rounded font-bold hover:bg-gray-800 transition flex items-center justify-center"
                        >
                          <Aperture className="w-4 h-4 mr-2" />
                          Open Camera
                        </button>
                        
                        <div className="relative">
                          <button className="w-full px-6 py-3 border border-gray-300 rounded font-bold text-thinklab-grey hover:bg-gray-100 transition flex items-center justify-center">
                             <Upload className="w-4 h-4 mr-2" />
                             Upload File
                          </button>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                    </div>
                  </div>
                )}
             </div>

             {/* Action Bar */}
             {!isCameraOpen && (
               <div className="mt-4 flex gap-4">
                  <button 
                    className="flex-1 py-3 border border-gray-300 rounded font-bold text-thinklab-black hover:bg-gray-50 transition flex items-center justify-center"
                    onClick={() => {
                       setImage(null);
                       setReport(null);
                       setErrorMsg(null);
                    }}
                    disabled={!image}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </button>
                  <button 
                    className={`flex-1 py-3 rounded font-bold text-white transition flex items-center justify-center ${!image ? 'bg-gray-300 cursor-not-allowed' : 'bg-thinklab-red hover:bg-red-700'}`}
                    onClick={runSafetyCheck}
                    disabled={!image || analyzing}
                  >
                    {analyzing ? 'Analyzing Hazards...' : 'Generate Safety Report'}
                  </button>
               </div>
             )}
          </div>
        )}

        {viewHistory && activeWorkspace && (
           <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden max-h-[600px] overflow-y-auto">
              <div className="p-4 bg-gray-50 font-bold border-b border-gray-200">Safety Incident Log</div>
              <div className="divide-y divide-gray-100">
                 {activeWorkspace.safetyReports?.length === 0 && (
                    <div className="p-8 text-center text-gray-400">No reports saved yet.</div>
                 )}
                 {activeWorkspace.safetyReports?.map((r, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-thinklab-grey">{r.date || 'Today'}</span>
                          <span className={`text-xs px-2 py-0.5 rounded font-bold text-white ${r.riskScore > 50 ? 'bg-thinklab-red' : 'bg-green-600'}`}>
                             Score: {r.riskScore}
                          </span>
                       </div>
                       <p className="text-sm font-bold text-thinklab-black mb-1">{r.summary}</p>
                       <p className="text-xs text-thinklab-grey">{r.hazards.length} hazards detected</p>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* Report Section */}
      <div className="space-y-6">
         {!report && !viewHistory && (
           <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded shadow-sm border border-gray-100 text-center">
              <ShieldAlert className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-400">No Analysis Results</h3>
              <p className="text-gray-400 text-sm mt-2">Capture a photo to detect hazards.</p>
           </div>
         )}

         {report && !viewHistory && (
           <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Header */}
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-thinklab-black">Safety Analysis Report</h3>
                <div className={`px-4 py-2 rounded-full font-bold text-white ${report.riskScore > 50 ? 'bg-thinklab-red' : 'bg-green-600'}`}>
                   Score: {report.riskScore}/100
                </div>
             </div>

             <div className="p-6 space-y-6">
                <div className="bg-gray-50 p-4 rounded text-sm text-thinklab-black">
                   <p>{report.summary}</p>
                </div>

                <div>
                   <h4 className="font-bold text-thinklab-black mb-4 uppercase text-xs tracking-wider">Detected Hazards</h4>
                   <div className="space-y-4">
                      {report.hazards.map((hazard, idx) => (
                        <div key={idx} className="flex gap-4 p-4 border rounded hover:shadow-sm transition bg-white">
                           <div className="mt-1">
                              {hazard.severity === 'High' ? (
                                <AlertOctagon className="w-6 h-6 text-thinklab-red" />
                              ) : (
                                <ShieldAlert className="w-6 h-6 text-yellow-500" />
                              )}
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-bold text-thinklab-black">{hazard.description}</h5>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${hazard.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {hazard.severity} Risk
                                </span>
                              </div>
                              <p className="text-sm text-thinklab-grey">{hazard.recommendation}</p>
                           </div>
                        </div>
                      ))}

                      {report.hazards.length === 0 && (
                        <div className="flex items-center gap-3 text-green-600">
                           <CheckCircle className="w-5 h-5" />
                           <span className="font-medium">No major hazards detected. Good job!</span>
                        </div>
                      )}
                   </div>
                </div>

                {activeWorkspace && (
                   <button 
                     onClick={handleSaveReport}
                     className="w-full py-4 bg-thinklab-black text-white rounded font-bold flex items-center justify-center hover:bg-gray-800 transition"
                   >
                      <Save className="w-5 h-5 mr-2" />
                      Save Report to Project Log
                   </button>
                )}
             </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default SafetyMonitor;
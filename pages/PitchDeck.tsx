import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ShieldCheck, TrendingUp, DollarSign, Users, Building2, HardHat, Globe, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';

const PitchDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useApp();

  const slides = [
    // Slide 1: Title
    {
      id: 'title',
      bg: 'bg-thinklab-black',
      render: () => (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
           <div className="w-32 h-32 mb-6 relative">
              <div className="absolute inset-0 bg-thinklab-red blur-[60px] opacity-20 rounded-full"></div>
              <Logo className="w-full h-full relative z-10" />
           </div>
           <div>
             <h1 className="text-6xl font-serif font-bold text-white tracking-tight mb-4">ThinkLab <span className="text-thinklab-red">SiteGuard</span></h1>
             <p className="text-xl text-gray-400 font-light tracking-[0.3em] uppercase">The Future of AI Construction Management</p>
           </div>
           <div className="mt-12 pt-8 border-t border-gray-800">
             <p className="text-sm text-gray-500">Presented by {user?.name || 'ThinkLab Group'}</p>
             <p className="text-xs text-gray-600 mt-1">{new Date().toLocaleDateString()}</p>
           </div>
        </div>
      )
    },
    // Slide 2: The Problem
    {
      id: 'problem',
      bg: 'bg-white',
      render: () => (
        <div className="h-full flex flex-col justify-center px-16">
           <h2 className="text-thinklab-red text-sm font-bold tracking-widest uppercase mb-4">The Challenge</h2>
           <h3 className="text-5xl font-serif font-bold text-thinklab-black mb-12 leading-tight">Construction is <br/>Costly, Chaotic & Risky.</h3>
           
           <div className="grid grid-cols-3 gap-8">
              <div className="p-8 bg-gray-50 rounded-xl border-l-4 border-red-500 shadow-sm">
                 <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="text-thinklab-red w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-bold text-thinklab-black mb-2">Safety Hazards</h4>
                 <p className="text-gray-600 text-sm">Construction accidents cost the global industry over $12B annually in liability and delays.</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-xl border-l-4 border-gray-800 shadow-sm">
                 <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="text-gray-800 w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-bold text-thinklab-black mb-2">Budget Overruns</h4>
                 <p className="text-gray-600 text-sm">98% of mega-projects suffer cost overruns of more than 30% due to poor resource planning.</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-xl border-l-4 border-gray-400 shadow-sm">
                 <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-gray-200">
                    <Target className="text-gray-600 w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-bold text-thinklab-black mb-2">Inventory Loss</h4>
                 <p className="text-gray-600 text-sm">Material shrinkage (theft/waste) accounts for 10-15% of total project material costs.</p>
              </div>
           </div>
        </div>
      )
    },
    // Slide 3: The Solution
    {
      id: 'solution',
      bg: 'bg-thinklab-black',
      render: () => (
        <div className="h-full flex flex-row items-center">
           <div className="w-1/2 px-12">
              <div className="flex items-center gap-2 mb-6">
                 <Logo className="w-10 h-10" />
                 <span className="text-white font-bold text-2xl">ThinkLab Platform</span>
              </div>
              <h3 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">
                An AI-Powered Ecosystem for the Modern Job Site.
              </h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                We integrate Generative AI to predict costs, monitor safety in real-time via computer vision, and automate daily reporting.
              </p>
              <ul className="space-y-4">
                 {[
                   'Real-time Hazard Detection via Camera', 
                   'Generative Lifecycle Planning', 
                   'Automated Inventory Forecasting',
                   'Instant Stakeholder Reporting'
                 ].map((item, i) => (
                   <li key={i} className="flex items-center text-white">
                      <CheckCircle2 className="text-thinklab-red w-5 h-5 mr-3" />
                      {item}
                   </li>
                 ))}
              </ul>
           </div>
           <div className="w-1/2 h-full bg-gray-900 relative overflow-hidden flex items-center justify-center">
              {/* Abstract UI representation */}
              <div className="w-3/4 bg-white rounded-lg shadow-2xl p-4 rotate-3 transform hover:rotate-0 transition duration-500">
                 <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 </div>
                 <div className="space-y-3">
                    <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                       <HardHat className="w-8 h-8" />
                    </div>
                    <div className="flex gap-2">
                       <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                       <div className="h-2 bg-thinklab-red rounded w-1/3"></div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-20 bg-blue-50 rounded border border-blue-100 p-2">
                       <div className="flex items-center gap-2 mb-1">
                          <Target className="w-3 h-3 text-blue-600" />
                          <span className="text-[8px] font-bold text-blue-800">AI Analysis Complete</span>
                       </div>
                       <div className="h-1 bg-blue-200 rounded w-full"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )
    },
    // Slide 4: Revenue Model
    {
       id: 'revenue',
       bg: 'bg-white',
       render: () => (
         <div className="h-full flex flex-col justify-center px-16">
            <div className="text-center mb-16">
               <h2 className="text-thinklab-red text-sm font-bold tracking-widest uppercase mb-2">Business Model</h2>
               <h3 className="text-4xl font-serif font-bold text-thinklab-black">How We Generate Revenue</h3>
            </div>
 
            <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
               <div className="text-center p-8 border border-gray-200 rounded-xl hover:shadow-xl transition hover:-translate-y-2">
                  <div className="w-16 h-16 bg-thinklab-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                     <Users className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-thinklab-black mb-2">SaaS Subscription</h4>
                  <p className="text-3xl font-serif font-bold text-thinklab-red mb-4">$49<span className="text-sm text-gray-500 font-sans font-normal">/user/mo</span></p>
                  <p className="text-sm text-gray-500">Recurring revenue from construction firms for platform access and data storage.</p>
               </div>
 
               <div className="text-center p-8 border border-gray-200 rounded-xl hover:shadow-xl transition hover:-translate-y-2 bg-gray-50">
                  <div className="w-16 h-16 bg-thinklab-red text-white rounded-full flex items-center justify-center mx-auto mb-6">
                     <Target className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-thinklab-black mb-2">Usage-Based AI</h4>
                  <p className="text-3xl font-serif font-bold text-thinklab-red mb-4">Pay-Per-Token</p>
                  <p className="text-sm text-gray-500">Margins on high-volume generative API calls for detailed architectural plans and video analysis.</p>
               </div>
 
               <div className="text-center p-8 border border-gray-200 rounded-xl hover:shadow-xl transition hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Building2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-thinklab-black mb-2">Marketplace</h4>
                  <p className="text-3xl font-serif font-bold text-thinklab-red mb-4">2-5%<span className="text-sm text-gray-500 font-sans font-normal"> Commission</span></p>
                  <p className="text-sm text-gray-500">Affiliate revenue from connecting low-stock alerts directly to material suppliers.</p>
               </div>
            </div>
         </div>
       )
    },
    // Slide 5: Market & Growth
    {
       id: 'market',
       bg: 'bg-thinklab-black',
       render: () => (
          <div className="h-full flex items-center px-16">
             <div className="w-1/2 pr-12">
                <h2 className="text-thinklab-red text-sm font-bold tracking-widest uppercase mb-4">Market Opportunity</h2>
                <h3 className="text-5xl font-serif font-bold text-white mb-8">The ConTech Revolution</h3>
                <p className="text-gray-400 text-lg mb-8">
                   The global construction market is valued at $12 Trillion, yet it is the second least digitized industry in the world.
                </p>
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <h4 className="text-4xl font-bold text-white mb-1">14.2%</h4>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">CAGR Growth</p>
                   </div>
                   <div>
                      <h4 className="text-4xl font-bold text-white mb-1">$15B</h4>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">TAM (Serviceable)</p>
                   </div>
                </div>
             </div>
             <div className="w-1/2">
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                   <div className="flex items-end space-x-4 h-64">
                      <div className="w-1/5 bg-gray-600 rounded-t h-[30%] relative group">
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-xs opacity-0 group-hover:opacity-100 transition">2023</div>
                      </div>
                      <div className="w-1/5 bg-gray-500 rounded-t h-[45%] relative group">
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-xs opacity-0 group-hover:opacity-100 transition">2024</div>
                      </div>
                      <div className="w-1/5 bg-gray-400 rounded-t h-[60%] relative group">
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-xs opacity-0 group-hover:opacity-100 transition">2025</div>
                      </div>
                      <div className="w-1/5 bg-gray-300 rounded-t h-[75%] relative group">
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-xs opacity-0 group-hover:opacity-100 transition">2026</div>
                      </div>
                      <div className="w-1/5 bg-thinklab-red rounded-t h-[95%] relative group shadow-[0_0_30px_rgba(208,2,27,0.5)]">
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold text-sm">2027</div>
                      </div>
                   </div>
                   <p className="text-center text-gray-400 mt-4 text-sm">Projected Adoption of AI in Construction</p>
                </div>
             </div>
          </div>
       )
    },
    // Slide 6: Contact
    {
       id: 'contact',
       bg: 'bg-white',
       render: () => (
          <div className="h-full flex flex-col items-center justify-center text-center">
             <Logo className="w-24 h-24 mb-8" />
             <h3 className="text-5xl font-serif font-bold text-thinklab-black mb-6">Let's Build the Future.</h3>
             <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12">
                ThinkLab SiteGuard is ready to deploy. Join us in making construction safer, smarter, and more profitable.
             </p>
             
             <div className="flex gap-6">
                <button className="px-8 py-4 bg-thinklab-black text-white font-bold rounded hover:bg-gray-800 transition flex items-center">
                   Contact Sales <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-white border-2 border-thinklab-black text-thinklab-black font-bold rounded hover:bg-gray-50 transition">
                   Request Demo
                </button>
             </div>
 
             <div className="mt-16 grid grid-cols-3 gap-12 text-left">
                <div>
                   <h5 className="font-bold text-thinklab-black mb-1">Email</h5>
                   <p className="text-gray-500">investors@thinklab.com</p>
                </div>
                <div>
                   <h5 className="font-bold text-thinklab-black mb-1">Headquarters</h5>
                   <p className="text-gray-500">Lagos, Nigeria</p>
                </div>
                <div>
                   <h5 className="font-bold text-thinklab-black mb-1">Website</h5>
                   <p className="text-gray-500">www.thinklab-group.com</p>
                </div>
             </div>
          </div>
       )
    }
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`fixed inset-0 z-[60] overflow-hidden ${slides[currentSlide].bg} transition-colors duration-500`}>
       {/* Controls */}
       <div className="absolute bottom-8 right-8 flex gap-4 z-50">
          <button 
             onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
             disabled={currentSlide === 0}
             className="p-3 rounded-full bg-black/10 hover:bg-black/20 disabled:opacity-30 backdrop-blur transition text-current"
          >
             <ChevronLeft className={slides[currentSlide].bg.includes('black') ? 'text-white' : 'text-black'} />
          </button>
          <span className={`font-serif font-bold text-xl self-center ${slides[currentSlide].bg.includes('black') ? 'text-white' : 'text-black'}`}>
             {currentSlide + 1} <span className="text-sm opacity-50">/ {slides.length}</span>
          </span>
          <button 
             onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
             disabled={currentSlide === slides.length - 1}
             className="p-3 rounded-full bg-black/10 hover:bg-black/20 disabled:opacity-30 backdrop-blur transition text-current"
          >
             <ChevronRight className={slides[currentSlide].bg.includes('black') ? 'text-white' : 'text-black'} />
          </button>
       </div>

       {/* Slide Content */}
       <div className="h-full w-full">
          {slides[currentSlide].render()}
       </div>

       {/* Progress Bar */}
       <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full">
          <div 
            className="h-full bg-thinklab-red transition-all duration-300 ease-out"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          ></div>
       </div>
    </div>
  );
};

export default PitchDeck;
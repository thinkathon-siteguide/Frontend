import React from 'react';
import Logo from '../../../components/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* LEFT SIDE - Brand & Visuals */}
      <div className="lg:w-1/2 bg-thinklab-black relative overflow-hidden flex flex-col justify-center items-center p-12 text-center text-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] animate-pulse"></div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-5 bg-gradient-to-br from-thinklab-red to-transparent pointer-events-none"></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-thinklab-red rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-200"></div>

        <div className="relative z-10 animate-fade-in-up">
            <div className="mb-6 flex justify-center">
                <div className="p-4 bg-white/10 rounded-full   backdrop-blur-sm border border-white/20 shadow-2xl">
                     <Logo className="w-20  rounded-full h-20 text-white" />
                </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-4">
              ThinkLab
            </h1>
            <p className="text-lg lg:text-xl text-gray-300 font-light tracking-wide mb-8">
              SiteGuard Solution
            </p>
            <div className="max-w-md mx-auto">
                <p className="text-sm text-gray-400 leading-relaxed">
                    "Building the future with intelligent construction management. AI-driven architecture, safety monitoring, and resource planning all in one workspace."
                </p>
            </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Form */}
      <div className="lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-16 relative">
         <div className="w-full max-w-md animate-fade-in-up animation-delay-200">
            {children}
         </div>
      </div>
    </div>
  );
};

export default AuthLayout;

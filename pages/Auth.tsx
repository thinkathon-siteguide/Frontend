import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login, register } = useApp();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let success;
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await register(name, email, password);
      }

      if (success) {
        navigate('/');
      } else {
        setError(isLogin ? 'Invalid credentials' : 'User already exists');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      
      {/* LEFT SIDE - Brand & Visuals */}
      <div className="lg:w-1/2 bg-thinklab-black relative overflow-hidden flex flex-col justify-center items-center p-12 text-center text-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] animate-pulse"></div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-5 bg-gradient-to-br from-thinklab-red to-transparent pointer-events-none"></div>

        <div className="relative z-10 animate-fade-in-up">
            <div className="mb-6 flex justify-center">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 shadow-2xl">
                     <Logo className="w-20 h-20 text-white" />
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
            
            {/* Dots Decoration */}
             <div className="flex gap-2 justify-center mt-8">
                <div className="w-2 h-2 rounded-full bg-thinklab-red"></div>
                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
             </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Form */}
      <div className="lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-16 relative">
         <div className="w-full max-w-md animate-fade-in-up animation-delay-200">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-thinklab-black mb-2 font-serif">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-500">
                    {isLogin ? 'Enter your credentials to access your workspace.' : 'Join ThinkLab to start managing your projects.'}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border-l-4 border-thinklab-red animate-fade-in flex items-center">
                    <span className="mr-2">⚠️</span> {error}
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
                {!isLogin && (
                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-focus-within:text-thinklab-red">Full Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-thinklab-red focus:ring-4 focus:ring-red-50 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                                placeholder="e.g. Engr. Adebayo"
                            />
                        </div>
                    </div>
                )}

                <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-focus-within:text-thinklab-red">Email Address</label>
                    <div className="relative">
                         <input 
                           type="email" 
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-thinklab-red focus:ring-4 focus:ring-red-50 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                           placeholder="name@company.com"
                         />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-focus-within:text-thinklab-red">Password</label>
                    <div className="relative">
                        <input 
                           type="password" 
                           required
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-thinklab-red focus:ring-4 focus:ring-red-50 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                           placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-thinklab-black text-white font-bold py-3.5 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-2 group"
                >
                  {loading ? (
                       <Loader2 className="animate-spin w-5 h-5 group-hover:text-thinklab-red transition-colors"/> 
                  ) : (
                       <span className="flex items-center gap-2">
                           {isLogin ? 'Sign In' : 'Get Started'} 
                           {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                       </span>
                  )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-500 text-sm">
                    {isLogin ? "New to ThinkLab? " : "Already have an account? "}
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-thinklab-red font-bold hover:text-red-700 hover:underline transition-colors ml-1"
                    >
                        {isLogin ? "Create an account" : "Sign in here"}
                    </button>
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Auth;
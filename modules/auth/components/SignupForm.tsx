import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface SignupFormProps {
  onToggle: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    signup.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          navigate('/');
        },
        onError: (err: any) => {
           setError(err.response?.data?.message || 'Signup failed');
        },
      }
    );
  };

  return (
    <div>
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-thinklab-black mb-2 font-serif">
                Create Account
            </h2>
            <p className="text-gray-500">
                Join ThinkLab to start managing your projects.
            </p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border-l-4 border-thinklab-red animate-fade-in flex items-center">
                <span className="mr-2">⚠️</span> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group animate-slide-in-right">
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

            <div className="group animate-fade-in-up animation-delay-100">
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

            <div className="group animate-fade-in-up animation-delay-200">
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
              disabled={signup.isPending}
              className="w-full bg-thinklab-black text-white font-bold py-3.5 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-2 group animate-fade-in-up animation-delay-300"
            >
              {signup.isPending ? (
                   <Loader2 className="animate-spin w-5 h-5 group-hover:text-thinklab-red transition-colors"/> 
              ) : (
                   <span className="flex items-center gap-2">
                       Get Started 
                       <span className="group-hover:translate-x-1 transition-transform">→</span>
                   </span>
              )}
            </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
                Already have an account? 
                <button 
                    onClick={onToggle}
                    className="text-thinklab-red font-bold hover:text-red-700 hover:underline transition-colors ml-1"
                >
                    Sign in here
                </button>
            </p>
        </div>
    </div>
  );
};

export default SignupForm;

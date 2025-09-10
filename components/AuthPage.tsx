import React, { useState, FormEvent } from 'react';
import type { User, UserRole } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('Operations');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (authMode === 'signup' && !name) {
      setError('Full name is required to sign up.');
      return;
    }

    // In a real app, you would have API calls here.
    // We will simulate a successful login/signup.
    const user: User = {
      name: authMode === 'signup' ? name : role === 'Operations' ? 'Operational Head' : 'Chief Inspector',
      email,
      role,
    };
    onLogin(user);
  };

  const isLogin = authMode === 'login';

  return (
    <div className="min-h-screen bg-metro-light-bg flex flex-col items-center justify-center p-4">
       <div className="flex items-center space-x-3 mb-6">
            <svg className="w-12 h-12 text-metro-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <div>
              <h1 className="text-3xl font-bold text-metro-text-heading">Kochi Metro</h1>
              <h2 className="text-lg font-semibold text-metro-blue -mt-1">AI Induction Planner</h2>
            </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-metro-border">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-metro-text-heading mb-2">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-center text-metro-text-body mb-6">
            {isLogin ? 'Sign in to access the planner' : 'Join a team to get started'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-metro-text-body mb-2">Select Your Team</label>
                <div className="grid grid-cols-2 gap-2 rounded-lg p-1 bg-gray-200">
                    <button type="button" onClick={() => setRole('Operations')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${role === 'Operations' ? 'bg-white text-metro-blue shadow' : 'text-gray-600'}`}>Operations</button>
                    <button type="button" onClick={() => setRole('Inspectors')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${role === 'Inspectors' ? 'bg-white text-metro-blue shadow' : 'text-gray-600'}`}>Inspectors</button>
                </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input id="name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} required 
                       className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-metro-blue focus:border-metro-blue"/>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required 
                     className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-metro-blue focus:border-metro-blue"/>
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required 
                     className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-metro-blue focus:border-metro-blue"/>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-metro-orange hover:bg-metro-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-metro-orange">
              {isLogin ? 'Login' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button type="button" onClick={() => setAuthMode(isLogin ? 'signup' : 'login')} className="font-medium text-metro-blue hover:underline ml-1">
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </form>
        </div>
      </div>
       <p className="text-xs text-gray-500 mt-6 text-center">&copy; {new Date().getFullYear()} Kochi Metro AI Induction Planner. For authorized personnel only.</p>
    </div>
  );
};

export default AuthPage;
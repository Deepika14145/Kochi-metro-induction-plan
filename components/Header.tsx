import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  onNavigateHome?: () => void;
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome, user, onLogout }) => {
  return (
    <header className="bg-metro-panel p-4 flex items-center justify-between border-b border-metro-border sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <svg className="w-10 h-10 text-metro-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <div>
              <h1 className="text-2xl font-bold text-metro-text-heading">Kochi Metro</h1>
              <h2 className="text-md font-semibold text-metro-blue -mt-1">AI Induction Planner</h2>
          </div>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="ml-8 text-sm font-semibold text-metro-blue hover:underline transition-colors hidden lg:flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-metro-text-heading">{user.name}</p>
            <p className="text-xs text-metro-text-body">{user.role} Team</p>
          </div>
           <button
              onClick={onLogout}
              className="bg-gray-200 text-metro-text-body font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 text-sm"
            >
              Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
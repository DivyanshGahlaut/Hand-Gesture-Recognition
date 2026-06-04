import React from 'react';
import { Hand, Cpu } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
            <Hand className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              GestureAI
            </h1>
            <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Hand Recognition System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Overview</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Settings</a>
          </nav>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

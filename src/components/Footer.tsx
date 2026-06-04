import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-sm text-gray-500">© 2024 GestureAI Recognition System</span>
            <p className="text-xs text-gray-600 max-w-xs text-center md:text-left">
              Advanced computer vision powered by MediaPipe and React for real-time interaction.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
              <Github className="w-5 h-5 text-gray-400" />
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
              <Twitter className="w-5 h-5 text-gray-400" />
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
              <Linkedin className="w-5 h-5 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

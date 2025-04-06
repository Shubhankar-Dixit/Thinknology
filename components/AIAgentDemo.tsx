import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AIAgentDemoProps {
  className?: string;
}

const AIAgentDemo: React.FC<AIAgentDemoProps> = ({ className = '' }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${className} relative`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
          <span className="text-xs font-mono ml-2">AI Agent Demo</span>
        </div>
        <button 
          onClick={toggleFullScreen}
          className="text-xs bg-tertiary/50 px-2 py-1 rounded hover:bg-tertiary/80 transition-colors"
        >
          {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <motion.div 
        className={`relative overflow-hidden border border-secondary/50 rounded-lg bg-background/95 ${
          isFullScreen 
            ? 'fixed top-0 left-0 right-0 bottom-0 z-50 m-4 flex items-center justify-center' 
            : 'h-96'
        }`}
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10">
            <div className="w-10 h-10 border-t-2 border-accent rounded-full animate-spin mb-4"></div>
            <p className="text-sm">Loading AI Agent...</p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src="https://theaidigest.org/agent"
          className="w-full h-full border-0"
          title="AI Agent Demo"
          sandbox="allow-scripts allow-same-origin allow-forms"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        />

        {isFullScreen && (
          <button
            onClick={toggleFullScreen}
            className="absolute top-4 right-4 bg-background/80 p-2 rounded-full hover:bg-background transition-colors z-20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </motion.div>

      <div className="mt-2 text-xs text-secondary/80 italic">
        <p>Experience a live AI agent similar to those used in customer service, research, and personal assistance applications.</p>
      </div>
    </div>
  );
};

export default AIAgentDemo;
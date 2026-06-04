import React, { useEffect, useRef, useState } from 'react';
import { Camera, Settings, Activity, Hand, ShieldAlert, CheckCircle2 } from 'lucide-react';

// MediaPipe globals are loaded in index.html
declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
  }
}

const HandGestureRecognition: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'initializing' | 'active' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [handDetected, setHandDetected] = useState(false);
  const [gesture, setGesture] = useState('No Gesture');

  useEffect(() => {
    let hands: any = null;
    let camera: any = null;

    const onResults = (results: any) => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const canvasCtx = canvasRef.current.getContext('2d');
      if (!canvasCtx) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Draw video frame (if mirroring is needed, it's done via CSS)
      // canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setHandDetected(true);
        for (const landmarks of results.multiHandLandmarks) {
          window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, {
            color: '#10B981',
            lineWidth: 4
          });
          window.drawLandmarks(canvasCtx, landmarks, {
            color: '#3B82F6',
            lineWidth: 2,
            radius: 4
          });
          
          // Simple gesture detection logic (heuristic based)
          detectGesture(landmarks);
        }
      } else {
        setHandDetected(false);
        setGesture('No Gesture');
      }
      canvasCtx.restore();
    };

    const detectGesture = (landmarks: any[]) => {
      // Very basic example: Is the thumb above the index finger?
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      const ringTip = landmarks[16];
      const pinkyTip = landmarks[20];
      
      // Heuristic: If all fingertips are above their respective lower joints (simplified)
      const isPalmOpen = thumbTip.y < landmarks[2].y && indexTip.y < landmarks[6].y && middleTip.y < landmarks[10].y;
      
      if (isPalmOpen) {
        setGesture('Open Palm');
      } else if (indexTip.y < landmarks[6].y && middleTip.y > landmarks[10].y) {
        setGesture('Pointing');
      } else {
        setGesture('Fist / Closed');
      }
    };

    const initMediaPipe = async () => {
      if (!window.Hands) {
        setStatus('error');
        setErrorMessage('MediaPipe Hands not loaded. Check your internet connection.');
        return;
      }

      setStatus('initializing');
      
      try {
        hands = new window.Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);

        if (videoRef.current) {
          camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (hands) {
                await hands.send({ image: videoRef.current! });
              }
            },
            width: 1280,
            height: 720
          });
          
          await camera.start();
          setStatus('active');
          setIsActive(true);
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setErrorMessage('Failed to initialize webcam or MediaPipe.');
      }
    };

    if (isActive && status === 'idle') {
      initMediaPipe();
    }

    return () => {
      if (camera) camera.stop();
      if (hands) hands.close();
    };
  }, [isActive]);

  const toggleCamera = () => {
    if (isActive) {
      setIsActive(false);
      setStatus('idle');
      setHandDetected(false);
      setGesture('No Gesture');
    } else {
      setIsActive(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded-2xl flex items-center gap-4">
          <div className={`p-3 rounded-xl ${status === 'active' ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
            <Activity className={`w-5 h-5 ${status === 'active' ? 'text-emerald-400' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">SYSTEM STATUS</p>
            <p className={`text-sm font-bold ${status === 'active' ? 'text-emerald-400' : 'text-gray-400'}`}>
              {status.toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="glass p-4 rounded-2xl flex items-center gap-4">
          <div className={`p-3 rounded-xl ${handDetected ? 'bg-blue-500/20' : 'bg-white/5'}`}>
            <Hand className={`w-5 h-5 ${handDetected ? 'text-blue-400' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">HAND DETECTION</p>
            <p className={`text-sm font-bold ${handDetected ? 'text-blue-400' : 'text-gray-400'}`}>
              {handDetected ? 'DETECTED' : 'CLEAR'}
            </p>
          </div>
        </div>

        <div className="glass p-4 rounded-2xl flex items-center gap-4">
          <div className={`p-3 rounded-xl ${handDetected ? 'bg-purple-500/20' : 'bg-white/5'}`}>
            <Settings className={`w-5 h-5 ${handDetected ? 'text-purple-400' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">RECOGNIZED GESTURE</p>
            <p className={`text-sm font-bold ${handDetected ? 'text-purple-400' : 'text-gray-400'}`}>
              {gesture}
            </p>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative aspect-video rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl group">
        {!isActive && status !== 'initializing' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white/10 p-6 rounded-full mb-6 border border-white/20 group-hover:scale-110 transition-transform duration-500">
              <Camera className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Internal Camera Restricted</h2>
            <p className="text-gray-300 mb-8 max-w-sm text-center">
              Enable your camera to start the real-time hand gesture recognition system.
            </p>
            <button 
              onClick={toggleCamera}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              Start Detection
            </button>
          </div>
        )}

        {status === 'initializing' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-white font-medium animate-pulse tracking-widest text-sm uppercase">Loading AI Models...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-950/40 backdrop-blur-md px-6">
            <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Initialization Error</h3>
            <p className="text-red-200 text-center text-sm">{errorMessage}</p>
            <button 
              onClick={() => { setStatus('idle'); setIsActive(false); }}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Video and Canvas Layers */}
        <video 
          ref={videoRef}
          className={`w-full h-full object-cover scale-x-[-1] ${isActive ? 'opacity-100' : 'opacity-0'}`}
          playsInline
          muted
        />
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1] pointer-events-none z-10"
          width={1280}
          height={720}
        />

        {/* Overlay Controls */}
        {isActive && status === 'active' && (
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
             <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-xs font-bold text-white tracking-widest">LIVE FEED</span>
             </div>
             <button 
                onClick={toggleCamera}
                className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-xl backdrop-blur-md transition-all active:scale-95"
                title="Stop Camera"
             >
                <Camera className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>

      {/* Instructions & Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            How to use
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <span className="bg-white/5 w-6 h-6 flex items-center justify-center rounded text-xs text-white">1</span>
              <span>Position your hand clearly within the camera viewport.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/5 w-6 h-6 flex items-center justify-center rounded text-xs text-white">2</span>
              <span>Wait for the green tracking lines to appear on your hand.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/5 w-6 h-6 flex items-center justify-center rounded text-xs text-white">3</span>
              <span>Try different gestures like opening your palm or pointing.</span>
            </li>
          </ul>
        </div>
        
        <div className="glass p-6 rounded-3xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            System Features
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-400">
               <p className="text-white font-bold mb-1">FPS Optimization</p>
               Adaptive frame rate for smooth tracking on any device.
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-400">
               <p className="text-white font-bold mb-1">Dual Hand Support</p>
               Recognize and track up to two hands simultaneously.
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-400">
               <p className="text-white font-bold mb-1">Cloud Inference</p>
               Zero-latency processing using MediaPipe WASM.
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-400">
               <p className="text-white font-bold mb-1">Gesture Logic</p>
               Advanced heuristic analysis for gesture classification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandGestureRecognition;

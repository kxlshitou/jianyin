import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { TrackClip, AssetType } from '../types';

interface PlayerProps {
  currentClip?: TrackClip;
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

const Player: React.FC<PlayerProps> = ({ 
  currentClip, 
  isPlaying, 
  currentTime, 
  totalDuration,
  onPlayPause,
  onSeek
}) => {
  // Since we are simulating a multi-track editor in a web browser without a heavy engine like ffmpeg.wasm,
  // we will display the "Current" clip at the playhead or a placeholder.
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] relative">
      {/* Viewport */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
        <div className="aspect-video bg-black w-full max-h-full shadow-2xl flex items-center justify-center overflow-hidden relative group border border-slate-800">
          {currentClip ? (
            currentClip.type === AssetType.VIDEO ? (
              <video 
                src={currentClip.src} 
                className="w-full h-full object-contain"
                // In a real editor, we'd sync this video element precisely with the global timer.
                // For this demo, we just show the source content.
                controls={false} 
                muted
              />
            ) : (
              <img src={currentClip.src} alt="Preview" className="w-full h-full object-contain" />
            )
          ) : (
            <div className="text-slate-600 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-slate-700 flex items-center justify-center mb-4">
                <Play size={32} fill="currentColor" className="ml-1" />
              </div>
              <p>No clip at playhead</p>
            </div>
          )}
          
          {/* Overlay Text (Simulation) */}
          <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
             {/* If we had text tracks, they would render here */}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="h-12 bg-[#0f172a] border-t border-slate-800 flex items-center justify-between px-4">
        <div className="text-xs font-mono text-cyan-400 w-24">
          {formatTime(currentTime)}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-white transition-colors" onClick={() => onSeek(0)}>
            <SkipBack size={18} />
          </button>
          <button 
            onClick={onPlayPause}
            className="w-8 h-8 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-cyan-900/50"
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </button>
          <button className="text-slate-400 hover:text-white transition-colors" onClick={() => onSeek(totalDuration)}>
            <SkipForward size={18} />
          </button>
        </div>

        <div className="text-xs font-mono text-slate-500 w-24 text-right">
          {formatTime(totalDuration)}
        </div>
      </div>
    </div>
  );
};

export default Player;
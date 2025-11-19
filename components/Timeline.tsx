import React, { useRef } from 'react';
import { Track, TrackClip } from '../types';
import { Video, Music, Type as TypeIcon, GripVertical } from 'lucide-react';

interface TimelineProps {
  tracks: Track[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onSelectClip: (clipId: string) => void;
  selectedClipId: string | null;
}

const PIXELS_PER_SECOND = 20;
const RULER_INTERVAL = 5; // seconds per major mark

const Timeline: React.FC<TimelineProps> = ({ 
  tracks, 
  currentTime, 
  duration, 
  onSeek,
  onSelectClip,
  selectedClipId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const scrollLeft = containerRef.current.scrollLeft;
      const time = Math.max(0, (x + scrollLeft) / PIXELS_PER_SECOND - 200/PIXELS_PER_SECOND); // adjusting for sidebar offset if needed, but here we assume direct mapping
      // A simpler approach for the demo:
      // The tracks area starts at some offset. Let's handle click on the "ruler" vs the "tracks"
    }
  };

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
     const rect = e.currentTarget.getBoundingClientRect();
     const clickX = e.clientX - rect.left;
     // Account for potential scrolling logic if we implemented it fully
     // For this simple demo, assume the container scrolls
     const scrollLeft = e.currentTarget.parentElement?.scrollLeft || 0;
     const newTime = (clickX + scrollLeft) / PIXELS_PER_SECOND;
     onSeek(newTime);
  };

  const renderRuler = () => {
    const marks = [];
    const totalWidth = Math.max(duration * PIXELS_PER_SECOND, window.innerWidth) + 200; // Extra space
    
    for (let i = 0; i < totalWidth / PIXELS_PER_SECOND; i += 1) {
      const isMajor = i % RULER_INTERVAL === 0;
      marks.push(
        <div 
          key={i} 
          className={`absolute bottom-0 border-l border-slate-600 ${isMajor ? 'h-3' : 'h-1.5'}`}
          style={{ left: i * PIXELS_PER_SECOND }}
        >
          {isMajor && (
            <span className="absolute top-[-14px] left-1 text-[10px] text-slate-500 select-none">
              {new Date(i * 1000).toISOString().substr(14, 5)}
            </span>
          )}
        </div>
      );
    }
    return (
      <div 
        className="h-8 bg-[#0f172a] border-b border-slate-800 relative w-full cursor-pointer"
        style={{ width: totalWidth }}
        onClick={handleRulerClick}
      >
        {marks}
      </div>
    );
  };

  return (
    <div className="h-64 bg-[#0f172a] border-t border-slate-800 flex flex-col select-none">
       {/* Toolbar */}
       <div className="h-10 border-b border-slate-800 flex items-center px-4 gap-4 bg-[#020617]">
         <div className="flex gap-2 text-slate-400 text-xs">
           <button className="hover:text-white">Split</button>
           <button className="hover:text-white">Delete</button>
           <button className="hover:text-white">Copy</button>
         </div>
         <div className="flex-1"></div>
         <div className="text-xs text-slate-500">Zoom</div>
       </div>

       {/* Scrollable Timeline Area */}
       <div className="flex-1 overflow-x-auto overflow-y-hidden relative" ref={containerRef}>
          
          {/* Ruler */}
          {renderRuler()}

          {/* Playhead Line (Absolute to the viewport, strictly needs to move with scroll or be fixed overlay? 
             Standard editor: Playhead moves with time, timeline scrolls if playhead goes off screen.
             Simple Web Demo: We scroll the timeline div. Playhead is absolute position based on time * px_per_sec.
          ) */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-cyan-400 z-20 pointer-events-none"
            style={{ left: currentTime * PIXELS_PER_SECOND }}
          >
            <div className="absolute -top-0 -left-1.5 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-cyan-400"></div>
          </div>

          {/* Tracks */}
          <div className="p-2 space-y-2" style={{ width: Math.max(duration * PIXELS_PER_SECOND, window.innerWidth) + 200 }}>
            {tracks.map((track) => (
              <div key={track.id} className="flex h-16 relative bg-slate-900/50 rounded-md border border-slate-800/50">
                {/* Track Header/Icon (sticky could be nice but complicated) */}
                <div className="absolute left-0 top-0 bottom-0 w-0 z-10 flex items-center justify-center">
                   {/* Hidden for clean timeline look, usually on the left sidebar of timeline */}
                </div>

                {/* Clips */}
                {track.clips.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClip(clip.id);
                    }}
                    className={`absolute top-1 bottom-1 rounded cursor-pointer overflow-hidden flex items-center px-2 text-xs transition-all border 
                      ${selectedClipId === clip.id ? 'border-cyan-400 ring-2 ring-cyan-400/20 z-10' : 'border-slate-700 hover:border-slate-500'}
                      ${track.type === 'MAIN' ? 'bg-slate-700' : track.type === 'AUDIO' ? 'bg-emerald-900/50' : 'bg-purple-900/50'}
                    `}
                    style={{
                      left: clip.startTime * PIXELS_PER_SECOND,
                      width: clip.duration * PIXELS_PER_SECOND,
                    }}
                  >
                    <div className="flex items-center gap-2 text-slate-200 truncate w-full">
                       {track.type === 'AUDIO' && <Music size={12} className="shrink-0 text-emerald-400" />}
                       {track.type === 'MAIN' && <Video size={12} className="shrink-0 text-blue-400" />}
                       {track.type === 'TEXT' && <TypeIcon size={12} className="shrink-0 text-purple-400" />}
                       <span className="truncate">{clip.name}</span>
                    </div>
                    
                    {/* Drag Handles (Visual only) */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/20"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/20"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
       </div>
    </div>
  );
};

export default Timeline;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Asset, Track, TrackClip, AssetType } from './types';
import { MOCK_ASSETS, INITIAL_TRACKS } from './constants';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Timeline from './components/Timeline';
import PropertiesPanel from './components/PropertiesPanel';
import { Download, Share2, Settings, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  // -- State --
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [duration, setDuration] = useState(30); // Default timeline length in seconds

  // -- Derived State --
  const selectedClip = useMemo(() => {
    for (const track of tracks) {
      const clip = track.clips.find(c => c.id === selectedClipId);
      if (clip) return clip;
    }
    return null;
  }, [tracks, selectedClipId]);

  const currentClipAtPlayhead = useMemo(() => {
    // Find the top-most visible clip at current time (Main or Overlay)
    // Priority: Overlay > Main
    const overlayTrack = tracks.find(t => t.type === 'OVERLAY');
    const mainTrack = tracks.find(t => t.type === 'MAIN');

    const findClip = (track?: Track) => track?.clips.find(c => currentTime >= c.startTime && currentTime < c.startTime + c.duration);

    return findClip(overlayTrack) || findClip(mainTrack);
  }, [tracks, currentTime]);

  // -- Handlers --

  const handleAddAssetToTimeline = (asset: Asset) => {
    // Determine target track based on asset type
    let trackType: Track['type'] = 'MAIN';
    if (asset.type === AssetType.AUDIO) trackType = 'AUDIO';
    if (asset.type === AssetType.TEXT) trackType = 'TEXT';
    
    const trackIndex = tracks.findIndex(t => t.type === trackType);
    if (trackIndex === -1) return;

    const newTracks = [...tracks];
    const targetTrack = newTracks[trackIndex];
    
    // Simple placement: Append to end of track
    const lastClip = targetTrack.clips[targetTrack.clips.length - 1];
    const startTime = lastClip ? lastClip.startTime + lastClip.duration : 0;

    const newClip: TrackClip = {
      id: `clip-${Date.now()}`,
      assetId: asset.id,
      trackId: targetTrack.id,
      startTime,
      duration: asset.duration,
      offset: 0,
      name: asset.name,
      type: asset.type,
      src: asset.src
    };

    targetTrack.clips.push(newClip);
    setTracks(newTracks);
    
    // Update total duration if needed
    if (startTime + asset.duration > duration) {
        setDuration(startTime + asset.duration + 10);
    }
  };

  const handleImportAsset = (asset: Asset) => {
    setAssets(prev => [asset, ...prev]);
  };

  const handleDeleteClip = (id: string) => {
    setTracks(prevTracks => prevTracks.map(track => ({
      ...track,
      clips: track.clips.filter(c => c.id !== id)
    })));
    setSelectedClipId(null);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, duration)));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // -- Effects --

  // Playback Timer
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0; // Loop or stop? Stop.
          }
          return prev + 0.1; // 100ms update
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-slate-200 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/20">
            <span className="font-bold text-white text-lg">J</span>
          </div>
          <div className="flex flex-col">
             <span className="text-sm font-semibold text-slate-100">Untitled Project</span>
             <span className="text-[10px] text-slate-500">Last saved just now</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2 bg-slate-800/50 rounded-full">
             <Settings size={14} /> Settings
          </button>
          <button 
            className="px-4 py-1.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-white rounded-full transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2"
            onClick={() => alert('Export feature simulated! Video would render here.')}
          >
             <Download size={14} /> Export
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Assets) */}
        <Sidebar 
          assets={assets} 
          onAddAssetToTimeline={handleAddAssetToTimeline}
          onImportAsset={handleImportAsset}
        />

        {/* Center & Bottom */}
        <div className="flex-1 flex flex-col min-w-0">
           
           {/* Top Section: Player + Properties */}
           <div className="flex-1 flex min-h-0">
              <Player 
                currentClip={currentClipAtPlayhead} 
                isPlaying={isPlaying}
                currentTime={currentTime}
                totalDuration={duration}
                onPlayPause={handlePlayPause}
                onSeek={handleSeek}
              />
              
              <PropertiesPanel 
                selectedClip={selectedClip}
                onDelete={handleDeleteClip}
              />
           </div>

           {/* Bottom Section: Timeline */}
           <Timeline 
              tracks={tracks}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              onSelectClip={setSelectedClipId}
              selectedClipId={selectedClipId}
           />
        </div>
      </div>
    </div>
  );
};

export default App;
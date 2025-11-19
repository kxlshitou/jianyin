import React from 'react';
import { TrackClip } from '../types';
import { Sliders, Volume2, FastForward, Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedClip: TrackClip | null;
  onDelete: (id: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedClip, onDelete }) => {
  if (!selectedClip) {
    return (
      <div className="w-72 bg-[#0f172a] border-l border-slate-800 p-8 flex flex-col items-center justify-center text-slate-500 text-sm">
        <Sliders size={48} className="mb-4 opacity-20" />
        <p className="text-center">Select a clip to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="w-72 bg-[#0f172a] border-l border-slate-800 flex flex-col">
      <div className="h-12 border-b border-slate-800 flex items-center px-4 font-semibold text-sm bg-[#020617]">
        {selectedClip.name}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Transform Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transform</h3>
          <div className="grid grid-cols-2 gap-2">
             <div className="bg-slate-900 p-2 rounded border border-slate-700">
                <label className="text-[10px] text-slate-500 block mb-1">Scale</label>
                <input type="number" className="w-full bg-transparent text-sm outline-none" defaultValue={100} />
             </div>
             <div className="bg-slate-900 p-2 rounded border border-slate-700">
                <label className="text-[10px] text-slate-500 block mb-1">Rotation</label>
                <input type="number" className="w-full bg-transparent text-sm outline-none" defaultValue={0} />
             </div>
             <div className="bg-slate-900 p-2 rounded border border-slate-700">
                <label className="text-[10px] text-slate-500 block mb-1">Position X</label>
                <input type="number" className="w-full bg-transparent text-sm outline-none" defaultValue={0} />
             </div>
             <div className="bg-slate-900 p-2 rounded border border-slate-700">
                <label className="text-[10px] text-slate-500 block mb-1">Position Y</label>
                <input type="number" className="w-full bg-transparent text-sm outline-none" defaultValue={0} />
             </div>
          </div>
        </div>

        {/* Volume Section (if applicable) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <Volume2 size={12} /> Volume
          </h3>
          <input type="range" className="w-full accent-cyan-400 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
        </div>

        {/* Speed Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <FastForward size={12} /> Speed
          </h3>
          <div className="flex gap-2">
            {[0.5, 1, 2, 5].map(speed => (
              <button key={speed} className={`flex-1 py-1 text-xs rounded border ${speed === 1 ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400' : 'border-slate-700 text-slate-400'}`}>
                {speed}x
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="p-4 border-t border-slate-800 bg-[#020617]">
        <button 
          onClick={() => onDelete(selectedClip.id)}
          className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2 rounded-md transition-colors text-sm"
        >
          <Trash2 size={16} /> Delete Clip
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
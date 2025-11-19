import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Music, 
  Type as TypeIcon, 
  Sparkles, 
  Plus, 
  Image as ImageIcon, 
  Film,
  Loader2
} from 'lucide-react';
import { Asset, AssetType } from '../types';
import { generateScript, generateAiImage } from '../services/geminiService';

interface SidebarProps {
  assets: Asset[];
  onAddAssetToTimeline: (asset: Asset) => void;
  onImportAsset: (asset: Asset) => void;
}

const TABS = [
  { id: 'media', icon: LayoutGrid, label: 'Media' },
  { id: 'audio', icon: Music, label: 'Audio' },
  { id: 'text', icon: TypeIcon, label: 'Text' },
  { id: 'ai', icon: Sparkles, label: 'AI Lab' },
];

const Sidebar: React.FC<SidebarProps> = ({ assets, onAddAssetToTimeline, onImportAsset }) => {
  const [activeTab, setActiveTab] = useState('media');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [generationType, setGenerationType] = useState<'SCRIPT' | 'IMAGE'>('SCRIPT');

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiResult('');

    try {
      if (generationType === 'SCRIPT') {
        const script = await generateScript(aiPrompt);
        setAiResult(script);
      } else {
        const imageUrl = await generateAiImage(aiPrompt);
        if (imageUrl) {
          // Automatically import generated image
          const newAsset: Asset = {
            id: `gen-${Date.now()}`,
            type: AssetType.IMAGE,
            src: imageUrl,
            name: `AI: ${aiPrompt.slice(0, 10)}...`,
            duration: 5,
            thumbnail: imageUrl
          };
          onImportAsset(newAsset);
          setAiResult("Image generated and added to Media library!");
        } else {
          setAiResult("Failed to generate image. Try a different prompt.");
        }
      }
    } catch (error) {
      setAiResult("An error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full bg-[#0f172a] border-r border-slate-800">
      {/* Icon Rail */}
      <div className="w-16 flex flex-col items-center py-4 space-y-6 border-r border-slate-800 bg-[#020617]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 text-xs p-2 rounded-lg transition-colors ${
              activeTab === tab.id 
                ? 'text-cyan-400 bg-slate-800/50' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="w-72 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h2 className="font-semibold text-slate-100 capitalize">{activeTab} Library</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'media' && (
            <div className="grid grid-cols-2 gap-3">
              {assets.map((asset) => (
                <div 
                  key={asset.id} 
                  className="group relative aspect-video bg-slate-800 rounded-md overflow-hidden cursor-pointer hover:ring-2 ring-cyan-400 transition-all"
                  onClick={() => onAddAssetToTimeline(asset)}
                >
                  {asset.type === AssetType.VIDEO || asset.type === AssetType.IMAGE ? (
                     <img src={asset.thumbnail || asset.src} alt={asset.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Music size={24} />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/60 truncate text-[10px] text-white">
                    {asset.name}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                    <Plus className="text-white drop-shadow-md" />
                  </div>
                </div>
              ))}
              
              {/* Upload Placeholder */}
              <label className="flex flex-col items-center justify-center aspect-video bg-slate-900 border border-dashed border-slate-700 rounded-md cursor-pointer hover:bg-slate-800 transition-colors">
                <Plus className="text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-500">Import</span>
                <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => {
                   if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const url = URL.createObjectURL(file);
                      const type = file.type.startsWith('video') ? AssetType.VIDEO : AssetType.IMAGE;
                      onImportAsset({
                        id: `local-${Date.now()}`,
                        type,
                        src: url,
                        name: file.name,
                        duration: 5, // Mock duration
                        thumbnail: type === AssetType.IMAGE ? url : undefined
                      });
                   }
                }}/>
              </label>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="flex space-x-2 bg-slate-900 p-1 rounded-lg">
                <button 
                  onClick={() => setGenerationType('SCRIPT')}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-all ${generationType === 'SCRIPT' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Script
                </button>
                <button 
                  onClick={() => setGenerationType('IMAGE')}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-all ${generationType === 'IMAGE' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Image Gen
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Prompt</label>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                  rows={4}
                  placeholder={generationType === 'SCRIPT' ? "E.g., A commercial for organic coffee..." : "E.g., A futuristic cyberpunk city street at night..."}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>

              <button 
                onClick={handleAiGenerate}
                disabled={isGenerating || !aiPrompt}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                Generate
              </button>

              {aiResult && (
                <div className="mt-4 p-3 bg-slate-900 rounded-md border border-slate-700">
                  <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-bold">Result</div>
                  <div className="text-xs text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                    {aiResult}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {(activeTab === 'audio' || activeTab === 'text') && (
             <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm">
                <p>Coming Soon</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
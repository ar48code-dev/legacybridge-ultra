import React, { useState, useEffect } from 'react';
import useLiveAPI from './hooks/useLiveAPI';

const SettingsModal = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('GOOGLE_API_KEY') || '');
  const [projectId, setProjectId] = useState(localStorage.getItem('GOOGLE_CLOUD_PROJECT') || '');

  const handleSave = () => {
    localStorage.setItem('GOOGLE_API_KEY', apiKey);
    localStorage.setItem('GOOGLE_CLOUD_PROJECT', projectId);
    onSave({ apiKey, projectId });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-3xl shadow-blue-500/10">
        <h3 className="text-2xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 flex items-center">
          <span className="mr-3">⚙️</span> SYSTEM HUD
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-blue-400/70 mb-2">Google AI Studio Key</label>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-blue-400/70 mb-2">GCP Project ID</label>
            <input 
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="my-project-123"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        <div className="mt-10 flex space-x-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all active:scale-95"
          >
            Save Matrix
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { startCapture, stopCapture, isCapturing, isGreenMode, toggleGreenMode } = useLiveAPI();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auto-open settings if keys are missing
  useEffect(() => {
    if (!localStorage.getItem('GOOGLE_API_KEY')) {
      setIsSettingsOpen(true);
    }
  }, []);

  return (
    <div 
      className="min-h-screen text-white font-sans selection:bg-blue-500 relative overflow-hidden bg-black"
      style={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark Overlay for better readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] z-0"></div>

      {/* Animated Gradient Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] z-10"></div>

      <div className="relative z-20 flex flex-col min-h-screen">
        <header className="px-10 py-8 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-0 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-500/20">
              <span className="text-2xl">🌉</span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                LEGACYBRIDGE <span className="text-white">ULTRA</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-blue-400/80 font-bold">Multimodal Migration Agent</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-blue-400 hover:text-blue-300"
              title="System Settings"
            >
              <span className="text-xl">⚙️</span>
            </button>
            <button 
              onClick={toggleGreenMode}
              className={`group relative flex items-center space-x-3 px-6 py-2.5 rounded-xl font-bold transition-all duration-500 overflow-hidden ${
                isGreenMode 
                  ? 'bg-green-500/10 border border-green-500/50 text-green-400' 
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isGreenMode ? 'bg-green-500 animate-pulse ring-4 ring-green-500/30' : 'bg-gray-600'}`}></div>
              <span className="text-sm font-black uppercase tracking-wider">
                {isGreenMode ? 'Green Mode: Optimized' : 'Green Mode: Default'}
              </span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-10 grid grid-cols-1 xl:grid-cols-12 gap-10 max-w-[1600px] mx-auto w-full">
          {/* Left Column: ADK Navigator */}
          <div className="xl:col-span-7 flex flex-col group">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black tracking-tight flex items-center text-white">
                <span className="mr-3 p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-blue-500/10 transition-colors">☸️</span> 
                UI NAVIGATOR <span className="ml-2 text-blue-500/50 font-normal">/</span> <span className="ml-2 text-indigo-400">LIVE AGENT</span>
              </h2>
              {isCapturing && (
                <div className="flex items-center bg-red-500/10 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-red-500 border border-red-500/30 animate-pulse">
                  SYSTEM ACTIVE
                </div>
              )}
            </div>
            
            <div className="aspect-video bg-black/80 rounded-3xl overflow-hidden border border-white/10 flex flex-col items-center justify-center relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group-hover:border-blue-500/30 transition-all duration-500 backdrop-blur-sm">
                {!isCapturing ? (
                  <div className="text-center p-12">
                    <div className="mb-8 relative">
                       <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
                       <div className="relative text-6xl mb-4">🎭</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Initialize Migration Stream</h3>
                    <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                      Gemini 2.0 Flash Live is ready to observe, hear, and automate your legacy workflows.
                    </p>
                    <button 
                      onClick={startCapture} 
                      className="group relative bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/40 transition-all duration-300 hover:scale-105"
                    >
                      <span className="relative z-10 flex items-center">
                        <span className="mr-3">🚀</span> START MISSION
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col">
                    {/* Simulated Camera View with UI Overlay */}
                    <div className="flex-1 border-b border-white/5 relative">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(0,0,0,0.4)_100%)]"></div>
                      <div className="absolute top-6 left-6 flex space-x-2">
                         <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                         <div className="text-[10px] font-black tracking-tighter text-white/50">CAM_STREAM_01 // 60FPS</div>
                      </div>
                    </div>
                    <div className="p-6 bg-black/60 flex justify-between items-center">
                      <div className="flex space-x-4">
                         <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-blue-400">LATENCY: 42MS</div>
                         <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-indigo-400">TOKENS: STABLE</div>
                      </div>
                      <button 
                        onClick={stopCapture} 
                        className="bg-white/10 hover:bg-red-600/20 text-white hover:text-red-400 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-red-500/30 transition-all"
                      >
                         ABORT SESSION
                      </button>
                    </div>
                  </div>
                )}
            </div>
            
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
               <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                     <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-black flex items-center justify-center text-[10px]">🤖</div>
                     <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-black flex items-center justify-center text-[10px]">☁️</div>
                     <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-black flex items-center justify-center text-[10px]">🧠</div>
                  </div>
                  <p className="text-xs text-gray-400 italic">
                    Gemini Live + ADK Executor connected. Multi-modal grounding active.
                  </p>
               </div>
            </div>
          </div>
          
          {/* Right Column: Creative Storyteller */}
          <div className="xl:col-span-5 flex flex-col group">
            <h2 className="text-xl font-black tracking-tight mb-6 flex items-center text-white">
              <span className="mr-3 p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-purple-500/10 transition-colors">✍️</span> 
              CREATIVE <span className="ml-2 text-purple-500">STORYTELLER</span>
            </h2>
            <div className="flex-1 bg-black/60 backdrop-blur-md rounded-3xl border border-white/10 p-8 overflow-y-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group-hover:border-purple-500/30 transition-all duration-500 relative">
              <div className="flex flex-col space-y-6">
                 {/* Placeholders for interleaved output (Text + Imagen 3 + TTS) */}
                 <div className="relative p-6 bg-white/5 rounded-2xl border-l-4 border-purple-500">
                    <div className="absolute -left-[2px] top-6 w-[4px] h-12 bg-purple-500 blur-sm opacity-50"></div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      <span className="text-purple-400 font-bold block mb-2 uppercase tracking-widest text-[10px]">System Notification</span>
                      Awaiting migration events to generate post-migration training materials...
                    </p>
                 </div>
                 
                 {/* Example of what a generated event might look like */}
                 <div className="animate-pulse opacity-20 select-none grayscale">
                    <div className="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-white/10 rounded mb-4"></div>
                    <div className="aspect-video bg-white/5 rounded-xl border border-white/10"></div>
                 </div>
              </div>

              {/* Bottom Glow */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
            </div>
            
            <div className="mt-8 flex justify-end">
               <div className="px-6 py-4 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center space-x-3">
                  <span className="text-purple-400 text-lg">💡</span>
                  <p className="text-[11px] text-gray-300 font-medium">
                    Automated training videos will be saved to <span className="font-mono text-purple-400">GCS_BUCKET</span>
                  </p>
               </div>
            </div>
          </div>
        </main>
        
        <footer className="p-10 text-center border-t border-white/5 bg-black/20">
           <p className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase leading-loose">
             LEGACYBRIDGE ULTRA // GEMINI LIVE API HACKATHON 2026 // BUILT BY GOOGLE CLOUD AGENTS
           </p>
        </footer>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={() => console.log('Matrix Saved')}
      />
    </div>
  );
}

export default App;

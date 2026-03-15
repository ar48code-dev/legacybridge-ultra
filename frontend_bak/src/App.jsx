import React from 'react';
import useLiveAPI from './hooks/useLiveAPI';

function App() {
  const { startCapture, stopCapture, isCapturing, isGreenMode, toggleGreenMode } = useLiveAPI();

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500">
      <header className="px-8 py-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          LegacyBridge ULTRA
        </h1>
        <button 
          onClick={toggleGreenMode}
          className={`px-5 py-2.5 rounded-full font-bold shadow-lg transition-all ${
            isGreenMode ? 'bg-green-500 hover:bg-green-400 text-black shadow-green-500/20' : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
          }`}
        >
          {isGreenMode ? '🌿 Green Mode: ON' : 'Green Mode: OFF'}
        </button>
      </header>
      
      <main className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="flex flex-col bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-200">
            <span className="mr-3">☸️</span> UI Navigator / Live Agent
          </h2>
          <div className="aspect-video bg-black rounded-xl overflow-hidden border border-gray-700 flex flex-col items-center justify-center relative shadow-inner">
             {!isCapturing ? (
               <button 
                 onClick={startCapture} 
                 className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center"
               >
                 <span className="mr-2">🗣️</span> Start Vision & Voice Stream
               </button>
             ) : (
               <button 
                 onClick={stopCapture} 
                 className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-red-600/30 transition-all flex items-center"
               >
                 <span className="mr-2">⏹️</span> Stop Stream
               </button>
             )}
             {isCapturing && (
               <div className="absolute top-4 right-4 flex items-center bg-black/60 px-3 py-1.5 rounded-full text-xs font-semibold text-red-500 backdrop-blur-sm border border-red-500/20">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></div> LIVE
               </div>
             )}
          </div>
        </div>
        
        <div className="flex flex-col bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-200">
            <span className="mr-3">✍️</span> Creative Storyteller
          </h2>
          <div className="flex-1 bg-black rounded-xl border border-gray-700 p-6 overflow-y-auto shadow-inner relative">
            <div className="flex flex-col space-y-4">
               {/* Placeholders for interleaved output (Text + Imagen 3 + TTS) */}
               <div className="text-gray-400 text-sm italic border-l-2 border-gray-600 pl-4">
                 Waiting for migration events...
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

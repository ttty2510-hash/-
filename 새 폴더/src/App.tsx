import React, { useState, useEffect, useRef } from 'react';
import { tracers } from './data/tracers';
import { useTTS } from './hooks/useTTS';
import './App.css';

function App() {
  const [selectedTracerId, setSelectedTracerId] = useState(tracers[0].id);
  const [activeTab, setActiveTab] = useState<'pathway' | 'prep'>('pathway');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  
  const currentTracer = tracers.find(t => t.id === selectedTracerId) || tracers[0];
  
  // Calculate current stage based on progress (1 to 5)
  // Stage 1: 0-19%, Stage 2: 20-39%, Stage 3: 40-59%, Stage 4: 60-79%, Stage 5: 80-100%
  const stageIndex = Math.min(Math.floor(progress / 20), 4);
  const currentStage = currentTracer.stages[stageIndex];
  
  // Custom TTS Hook with perfect sync
  useTTS(currentStage.ttsText, isPlaying);

  // Simulation timer
  useEffect(() => {
    let interval: number;
    if (isPlaying && progress < 100) {
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5; // Controls speed of simulation
        });
      }, 50); // 50ms interval for smooth progress bar
    } else if (progress >= 100) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  // Reset when tracer changes
  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
    
    // Update CSS variables for active color
    document.documentElement.style.setProperty('--active-color', currentTracer.color);
    document.documentElement.style.setProperty('--active-color-light', currentTracer.color + '15'); // 15 is hex for ~8% opacity
  }, [selectedTracerId, currentTracer.color]);

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const getDotPosition = () => {
    // Simple interpolation for dot position based on progress
    if (progress < 20) return { top: '30%', left: '35%' }; // Arm/Vein
    if (progress < 40) return { top: '40%', left: '50%' }; // Heart/Circulation
    
    // Organ specific
    if (currentTracer.id === 'fdg' || currentTracer.id === 'fbb' || currentTracer.id === 'fpcit') {
      if (progress < 60) return { top: '15%', left: '50%' }; // Brain
      if (progress < 80) return { top: '15%', left: '50%' }; // Stays in Brain
      return { top: '15%', left: '50%' };
    } else if (currentTracer.id === 'psma') {
      if (progress < 60) return { top: '70%', left: '50%' }; // Prostate area
      if (progress < 80) return { top: '70%', left: '50%' }; // Stays in Prostate area
      return { top: '70%', left: '50%' };
    }
    
    return { top: '50%', left: '50%' };
  };

  const dotPos = getDotPosition();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full text-slate-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>
      {/* Header - Dark Blue like original */}
      <header className="bg-[#1e40af] text-white p-4 shadow-md flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M12 12l3.5 -6"></path><path d="M12 12l3.5 6"></path><path d="M12 12l-7 0"></path></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold m-0">방사성의약품 생체분포 시뮬레이터</h1>
            <p className="text-xs text-blue-200 m-0 mt-1">Radiopharmaceutical Biodistribution Simulator</p>
          </div>
        </div>
        <div className="text-right hidden md:block text-sm text-blue-100">
          신구대학교 방사선학과<br/>
          Department of Radiological Science
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 max-w-[1600px] mx-auto w-full">
        
        {/* LEFT PANEL: Tracer Selection & Controls */}
        <aside className="w-full md:w-[300px] flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
              방사성의약품 선택
            </div>
            <div className="p-3 flex flex-col gap-3">
              {tracers.map(tracer => (
                <button 
                  key={tracer.id}
                  onClick={() => setSelectedTracerId(tracer.id)}
                  className={`nav-btn relative text-left p-4 rounded-lg border transition-all ${
                    selectedTracerId === tracer.id 
                      ? 'border-l-4 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                  style={selectedTracerId === tracer.id ? { 
                    borderLeftColor: tracer.color, 
                    backgroundColor: tracer.color + '10',
                    borderColor: tracer.color + '40'
                  } : {}}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tracer.color }}
                    ></div>
                    <span className="font-bold text-slate-800">{tracer.name}</span>
                  </div>
                  <div className="text-xs text-slate-500 pl-5">
                    {tracer.clinicalUse}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mt-auto">
            <div className="text-xs font-semibold text-slate-500 mb-3">시뮬레이션 제어</div>
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-3 px-4 rounded-lg font-bold text-white transition-all flex justify-center items-center gap-2 shadow-sm hover:shadow-md"
                style={{ backgroundColor: currentTracer.color }}
              >
                {isPlaying ? (
                  <><span className="text-xl leading-none">⏸</span> 일시정지</>
                ) : (
                  <><span className="text-xl leading-none">▶</span> 시작</>
                )}
              </button>
              <button 
                onClick={handleReset}
                className="py-3 px-4 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
              >
                ↺ 초기화
              </button>
            </div>
            
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>진행률</span>
              <span style={{ color: currentTracer.color }} className="font-bold">{Math.floor(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%`, backgroundColor: currentTracer.color }}
              ></div>
            </div>
          </div>
        </aside>

        {/* CENTER PANEL: Pathway / Prep */}
        <section className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button 
              className={`flex-1 py-4 font-bold text-sm transition-all ${
                activeTab === 'pathway' 
                  ? 'text-white' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              style={activeTab === 'pathway' ? { backgroundColor: currentTracer.color } : {}}
              onClick={() => setActiveTab('pathway')}
            >
              체내 경로
            </button>
            <button 
              className={`flex-1 py-4 font-bold text-sm transition-all ${
                activeTab === 'prep' 
                  ? 'text-white' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              style={activeTab === 'prep' ? { backgroundColor: currentTracer.color } : {}}
              onClick={() => setActiveTab('prep')}
            >
              검사 준비
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col h-full bg-slate-50">
            {activeTab === 'pathway' ? (
              <div className="flex flex-col h-full gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-1">{currentTracer.name} 체내 경로</h3>
                  <p className="text-sm text-slate-500 m-0">{currentTracer.fullName}</p>
                </div>
                
                {/* Silhouette Visualization Area */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm relative flex justify-center items-center overflow-hidden p-8 min-h-[400px]">
                  
                  {/* Human Silhouette SVG */}
                  <div className="relative h-full max-h-[500px] w-[200px] opacity-80">
                    <svg viewBox="0 0 100 250" className="w-full h-full text-slate-200" fill="currentColor">
                      {/* Head */}
                      <circle cx="50" cy="20" r="15" stroke="#cbd5e1" strokeWidth="2"/>
                      {/* Body */}
                      <path d="M 30 45 L 70 45 C 80 45 85 50 85 65 L 85 120 C 85 125 80 130 70 130 L 65 130 L 65 240 C 65 245 60 250 55 250 L 52 250 C 47 250 45 245 45 240 L 45 130 L 30 130 Z" stroke="#cbd5e1" strokeWidth="2" fill="none"/>
                      <path d="M 70 45 L 30 45 C 20 45 15 50 15 65 L 15 120 C 15 125 20 130 30 130 L 35 130 L 35 240 C 35 245 40 250 45 250 L 48 250 C 53 250 55 245 55 240 L 55 130 L 70 130 Z" stroke="#cbd5e1" strokeWidth="2" fill="none"/>
                      <path d="M30 45 Q 50 30 70 45" stroke="#cbd5e1" strokeWidth="2" fill="none"/>
                    </svg>

                    {/* Dynamic Target Organ Highlights based on Tracer */}
                    <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: progress > 30 ? 1 : 0 }}>
                      {currentTracer.id === 'fdg' && (
                        <>
                          <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[24px] h-[24px] rounded-full border-2 border-blue-400 bg-blue-400/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                          <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[20px] h-[20px] rounded-full border-2 border-blue-400 bg-blue-400/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        </>
                      )}
                      {currentTracer.id === 'fbb' && (
                        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[26px] h-[26px] rounded-full border-2 border-purple-400 bg-purple-400/30 shadow-[0_0_20px_rgba(139,92,246,0.6)]"></div>
                      )}
                      {currentTracer.id === 'fpcit' && (
                        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[16px] h-[12px] rounded-full border-2 border-pink-400 bg-pink-400/40 shadow-[0_0_15px_rgba(236,72,153,0.6)]"></div>
                      )}
                      {currentTracer.id === 'psma' && (
                        <div className="absolute top-[68%] left-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full border-2 border-amber-400 bg-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
                      )}
                    </div>

                    {/* Animated Tracer Dot */}
                    {progress > 0 && progress < 100 && (
                      <div 
                        className="absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out glowing-dot z-10"
                        style={{ 
                          top: dotPos.top, 
                          left: dotPos.left,
                          backgroundColor: currentTracer.color,
                          boxShadow: `0 0 15px ${currentTracer.color}`
                        }}
                      ></div>
                    )}
                  </div>
                </div>

                {/* Stage Info Card - Dynamic Sync with TTS */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-2 flex justify-between items-center text-xs font-bold text-white" style={{ backgroundColor: currentTracer.color }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                      현재 단계: {currentStage.title}
                    </div>
                    <div>{currentStage.id} / 5 단계</div>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <p className="text-slate-700 m-0 text-sm leading-relaxed">
                      {currentStage.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-full">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-2xl" style={{ color: currentTracer.color }}>📝</span> 
                    {currentTracer.prepGuides.title}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {currentTracer.prepGuides.content.map((guide, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-700">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5" style={{ backgroundColor: currentTracer.color }}>
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed">{guide}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800">
                  <span className="text-xl">⚠️</span>
                  <p className="text-sm m-0">정확한 검사 결과를 위해 위 주의사항을 반드시 지켜주시기 바랍니다. 주의사항 미준수 시 검사가 지연되거나 취소될 수 있습니다.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT PANEL: Clinical Image & Data */}
        <aside className="w-full md:w-[320px] flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[350px]">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
              PET/CT 임상 영상
            </div>
            <div className="flex-1 bg-black flex items-center justify-center p-2 relative">
              <img 
                src={currentTracer.imagePath} 
                alt={`${currentTracer.name} clinical PET/CT image`} 
                className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${progress > 10 ? 'opacity-100' : 'opacity-30'}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='sans-serif'%3EImage Loading...%3C/text%3E%3C/svg%3E";
                }}
              />
              {progress < 10 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white/70 text-sm">
                  시뮬레이션을 시작하세요
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
              임상 활용 정보
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">표적 장기</div>
                <div className="text-sm font-semibold text-slate-800">{currentTracer.targetOrgans}</div>
              </div>
              
              <div>
                <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">임상 활용</div>
                <div className="text-sm text-slate-700 leading-relaxed">{currentTracer.clinicalUse}</div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-400 mb-2 mt-4 uppercase tracking-wider flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded text-white text-[10px]" style={{ backgroundColor: currentTracer.color }}>SUV</span> 표준화섭취계수 범위
                </div>
                <ul className="space-y-2 mt-2">
                  {currentTracer.suvRanges.map((suv, idx) => (
                    <li key={idx} className="flex justify-between items-center text-xs border-b border-slate-100 pb-2 last:border-0">
                      <span className="text-slate-600 font-medium">{suv.organ}</span>
                      <span className="font-bold" style={{ color: currentTracer.color }}>{suv.range}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default App;

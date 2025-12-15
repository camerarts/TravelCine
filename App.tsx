import React, { useState, useEffect } from 'react';
import { generatePosterImage } from './services/geminiService';
import { AppState, PosterFormData, LocationData } from './types';
import { InputGroup } from './components/InputGroup';
import { LoadingScreen } from './components/LoadingScreen';
import { buildPrompt, DEFAULT_PROMPT_TEMPLATE } from './constants';
import { SettingsModal } from './components/SettingsModal';

const DEFAULT_LOCATIONS: [LocationData, LocationData, LocationData] = [
  { name: "", date: "" },
  { name: "", date: "" },
  { name: "", date: "" }
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Settings & Template State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [promptTemplate, setPromptTemplate] = useState<string>(DEFAULT_PROMPT_TEMPLATE);

  // Load saved template on mount
  useEffect(() => {
    const savedTemplate = localStorage.getItem('poster_prompt_template');
    if (savedTemplate) {
      setPromptTemplate(savedTemplate);
    }
  }, []);

  const handleSaveTemplate = (newTemplate: string) => {
    setPromptTemplate(newTemplate);
    localStorage.setItem('poster_prompt_template', newTemplate);
  };
  
  const [formData, setFormData] = useState<PosterFormData>({
    title: "",
    englishTitle: "",
    locations: DEFAULT_LOCATIONS,
    referenceImage: null
  });

  const handleLocationChange = (index: 0 | 1 | 2, field: keyof LocationData, value: string) => {
    const newLocations = [...formData.locations] as [LocationData, LocationData, LocationData];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setFormData(prev => ({ ...prev, locations: newLocations }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, referenceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1: Generate Prompt Text
  const handleGeneratePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the custom template from state
    const prompt = buildPrompt(formData, promptTemplate);
    setCurrentPrompt(prompt);
    setAppState(AppState.PROMPT_REVIEW);
    
    // On mobile, scroll to the prompt section
    if (window.innerWidth < 1024) {
        document.getElementById('right-column')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Step 2: Confirm Prompt and Generate Image
  const handleConfirmAndGenerate = async () => {
    setAppState(AppState.GENERATING);
    setErrorMsg(null);

    try {
      const imageUrl = await generatePosterImage(currentPrompt, formData.referenceImage);
      setGeneratedImage(imageUrl);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      setAppState(AppState.ERROR);
      setErrorMsg("海报生成失败，请检查您的 API Key 并重试。");
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `travel-poster-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-cine-900 text-slate-200">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cine-gold/5 to-transparent opacity-30" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      {appState === AppState.GENERATING && <LoadingScreen />}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        currentTemplate={promptTemplate}
        onSaveTemplate={handleSaveTemplate}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 glass-panel shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📸</span>
            <span className="text-xl font-serif font-bold text-white tracking-widest">TravelCine</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
              <a href="#" className="hover:text-cine-gold transition-colors">画廊</a>
              <a href="#" className="hover:text-cine-gold transition-colors">定价</a>
            </div>
            
            {/* Settings Button */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-cine-gold transition-colors rounded-full hover:bg-white/5"
              title="设置"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout: 2 Columns */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Form Input */}
        <div className="flex flex-col space-y-6 animate-fade-in-left">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
              定制您的 <span className="text-cine-gold">电影感海报</span>
            </h1>
            <p className="text-gray-400 text-sm">
              填写详细行程信息，生成专属的旅行回忆。
            </p>
          </div>

          <form onSubmit={handleGeneratePrompt} className="space-y-5 glass-panel p-6 rounded-2xl shadow-xl border border-white/5">
            {/* Header Info - Side by Side enforced strict 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <InputGroup 
                label="旅行主题 (中文)" 
                id="title" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                placeholder="例如：云南印象" 
                required
              />
              <InputGroup 
                label="旅行主题 (英文)" 
                id="enTitle" 
                value={formData.englishTitle} 
                onChange={(e) => setFormData({...formData, englishTitle: e.target.value})} 
                placeholder="例如：Yunnan Journey" 
                required
              />
            </div>
            
            {/* Locations */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-white font-medium flex items-center text-sm">
                <span className="w-5 h-5 rounded-full bg-cine-gold text-cine-900 flex items-center justify-center text-xs font-bold mr-2">📍</span>
                行程安排 (3个站点)
              </h3>
              <p className="text-xs text-gray-500 mb-2">日期将自动计算海报的行程范围。</p>
              {[0, 1, 2].map((i) => (
                <div key={i} className="grid grid-cols-3 gap-3">
                   <InputGroup 
                      className="col-span-2"
                      label={`第 ${i+1} 站名称`} 
                      id={`loc${i}`} 
                      value={formData.locations[i as 0|1|2].name} 
                      onChange={(e) => handleLocationChange(i as 0|1|2, 'name', e.target.value)} 
                      placeholder={i === 0 ? "例如：大理古城" : i === 1 ? "例如：玉龙雪山" : "例如：雨崩村"}
                      required
                    />
                    <InputGroup 
                      className="col-span-1"
                      label="日期" 
                      id={`date${i}`} 
                      type="date"
                      value={formData.locations[i as 0|1|2].date} 
                      onChange={(e) => handleLocationChange(i as 0|1|2, 'date', e.target.value)} 
                      required
                    />
                </div>
              ))}
            </div>

            {/* Reference Image */}
            <div className="pt-4 border-t border-white/10">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                人物参考照片
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-lg hover:border-cine-gold transition-colors cursor-pointer group relative bg-slate-800/30">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                <div className="space-y-1 text-center">
                  {formData.referenceImage ? (
                    <div className="relative w-full h-24">
                        <img src={formData.referenceImage} alt="Preview" className="h-full mx-auto object-contain rounded" />
                        <p className="text-xs text-green-400 mt-2">✓ 已上传</p>
                    </div>
                  ) : (
                    <>
                        <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-cine-gold transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-xs text-gray-400 justify-center mt-2">
                            <span className="relative font-medium text-cine-gold">点击上传</span>
                            <p className="pl-1">或拖拽</p>
                        </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white font-bold rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              disabled={appState === AppState.GENERATING}
            >
               <span>Step 1: 生成提示词</span>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
               </svg>
            </button>
            {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
          </form>
        </div>

        {/* RIGHT COLUMN: Prompt Review & Preview */}
        <div id="right-column" className="flex flex-col gap-6 lg:sticky lg:top-24 animate-fade-in-right">
          
          {/* Top Half: Prompt Confirmation */}
          <div className={`glass-panel rounded-2xl p-5 border border-white/10 flex flex-col transition-all duration-300 ${appState === AppState.IDLE ? 'opacity-50 grayscale' : 'opacity-100 shadow-cine-gold/10 shadow-xl'}`}>
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-serif font-bold flex items-center gap-2 text-lg">
                   <span className={`w-2 h-2 rounded-full ${appState === AppState.IDLE ? 'bg-gray-500' : 'bg-cine-gold'}`}></span>
                   确认海报提示词
                </h3>
                
                <div className="flex items-center gap-2">
                  {appState === AppState.IDLE && (
                      <span className="text-xs text-gray-400 bg-slate-800 px-2 py-1 rounded">等待输入...</span>
                  )}
                  {currentPrompt && (
                    <button 
                        onClick={copyToClipboard}
                        className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 border border-slate-600 shadow-sm"
                        title="复制到剪贴板"
                    >
                        {copySuccess ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-green-400 font-medium">已复制</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>复制</span>
                            </>
                        )}
                    </button>
                  )}
                </div>
             </div>
             
             <textarea 
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                className="w-full bg-cine-900/80 p-4 rounded-xl text-gray-300 font-mono text-sm border border-slate-700 focus:border-cine-gold focus:ring-1 focus:ring-cine-gold outline-none resize-none mb-4 custom-scrollbar h-48 transition-colors"
                placeholder="此处将显示生成的提示词，您可以在生成图片前进行最终修改..."
                disabled={appState === AppState.GENERATING || appState === AppState.IDLE}
            />
            
            <button
                onClick={handleConfirmAndGenerate}
                disabled={appState === AppState.IDLE || appState === AppState.GENERATING || appState === AppState.SUCCESS}
                className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg
                    ${appState === AppState.IDLE 
                        ? 'bg-slate-800 text-gray-500 cursor-not-allowed' 
                        : appState === AppState.SUCCESS 
                            ? 'bg-green-600 text-white cursor-default' 
                            : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white hover:scale-[1.01] shadow-yellow-500/20'
                    }`}
            >
                {appState === AppState.GENERATING ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        生成中...
                    </>
                ) : appState === AppState.SUCCESS ? (
                    '✨ 生成完成'
                ) : (
                    'Step 2: 确认并生成海报'
                )}
            </button>
          </div>

          {/* Bottom Half: Preview Area */}
          <div className="glass-panel rounded-2xl border border-white/10 p-2 min-h-[400px] flex flex-col relative overflow-hidden">
             <div className="absolute top-4 left-4 z-10 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                 <h3 className="text-white font-medium text-xs tracking-wider">PREVIEW</h3>
             </div>
             
             {generatedImage && (
                 <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button onClick={downloadImage} className="bg-cine-gold text-cine-900 px-3 py-1 rounded-full text-xs font-bold hover:bg-white transition-colors shadow-lg">
                        下载 HD
                    </button>
                 </div>
             )}

             <div className="flex-1 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden relative group">
                {generatedImage ? (
                    <img 
                        src={generatedImage} 
                        alt="Generated Poster" 
                        className="w-full h-full object-contain cursor-zoom-in transition-transform duration-700 hover:scale-[1.02]"
                        onClick={() => {
                            const win = window.open();
                            if(win) {
                                win.document.write('<img src="' + generatedImage + '" style="width:100%; height:auto; margin:0; background:#0f172a;">');
                            }
                        }}
                    />
                ) : (
                    <div className="text-center p-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                            <span className="text-3xl opacity-50">🖼️</span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium">海报预览区</p>
                        <p className="text-gray-600 text-xs mt-1">9:16 竖版高清</p>
                    </div>
                )}
             </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;

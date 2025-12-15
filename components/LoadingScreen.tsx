import React, { useEffect, useState } from 'react';

const STEPS = [
  "正在分析行程数据...",
  "正在提取人物特征...",
  "正在获取卫星地图数据...",
  "正在构图电影级画面...",
  "正在渲染最终海报..."
];

export const LoadingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cine-900/95 backdrop-blur-xl">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-cine-gold/30 rounded-full animate-ping"></div>
        <div className="absolute inset-0 border-4 border-t-cine-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cine-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-serif text-white mb-2 tracking-wider">正在生成回忆</h2>
      <div className="h-6 overflow-hidden relative">
          <p key={currentStep} className="text-cine-gold font-mono text-sm animate-fade-in-up">
            {`> ${STEPS[currentStep]}`}
          </p>
      </div>

      <div className="mt-8 w-64 h-1 bg-slate-700 rounded-full overflow-hidden">
        <div 
            className="h-full bg-cine-gold transition-all duration-500 ease-out" 
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%`}}
        ></div>
      </div>
    </div>
  );
};
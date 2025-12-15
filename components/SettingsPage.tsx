import React, { useState } from 'react';
import { DEFAULT_PROMPT_TEMPLATE } from '../constants';

interface SettingsPageProps {
  onBack: () => void;
  currentTemplate: string;
  onSaveTemplate: (newTemplate: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
  onBack, currentTemplate, onSaveTemplate 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [template, setTemplate] = useState(currentTemplate);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('密码错误');
    }
  };

  const handleSave = () => {
    onSaveTemplate(template);
    alert('设置已保存');
  };

  const handleReset = () => {
    if (window.confirm('确定要恢复默认提示词吗？您的修改将丢失。')) {
      setTemplate(DEFAULT_PROMPT_TEMPLATE);
    }
  };

  return (
    <div className="min-h-screen bg-cine-900 text-slate-200 font-sans flex flex-col animate-fade-in">
      {/* Navbar / Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-medium">返回主页</span>
                </button>
                <div className="h-6 w-px bg-white/10 mx-2"></div>
                <h1 className="text-lg font-serif font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="text-cine-gold">⚙️</span> 后台提示词设置
                </h1>
            </div>
            {isAuthenticated && (
                <div className="flex items-center gap-3">
                     <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors hover:bg-red-500/10 rounded-lg"
                      >
                        恢复默认
                      </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 bg-cine-gold text-cine-900 font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
                    >
                        保存修改
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
         {!isAuthenticated ? (
             <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                  <div className="w-full max-w-md bg-slate-800/50 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
                      <div className="text-center mb-8">
                          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cine-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-white">管理员登录</h2>
                          <p className="text-gray-400 text-sm mt-2">请输入密码以访问后台配置</p>
                      </div>
                      
                      <form onSubmit={handleLogin} className="space-y-6">
                          <div>
                              <input
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="请输入密码"
                                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-xl focus:ring-2 focus:ring-cine-gold focus:border-transparent outline-none text-white text-center text-lg tracking-widest placeholder-gray-600 transition-all"
                                  autoFocus
                              />
                          </div>
                          {error && (
                              <div className="bg-red-500/10 text-red-400 text-sm py-2 px-3 rounded-lg text-center flex items-center justify-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {error}
                              </div>
                          )}
                          <button
                              type="submit"
                              className="w-full py-3.5 bg-gradient-to-r from-cine-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-400 text-cine-900 font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                              验证身份
                          </button>
                      </form>
                  </div>
             </div>
         ) : (
             <div className="flex-1 flex flex-col gap-6 h-full">
                 <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                     </svg>
                     <div className="text-sm">
                         <h4 className="text-blue-200 font-bold mb-1">模板变量指南</h4>
                         <p className="text-blue-300/80 leading-relaxed">
                            系统会自动替换以下变量，请务必保留：<br/>
                            <code className="bg-blue-900/50 px-1 py-0.5 rounded text-blue-200 mx-1">{`{{title}}`}</code> 
                            <code className="bg-blue-900/50 px-1 py-0.5 rounded text-blue-200 mx-1">{`{{englishTitle}}`}</code>
                            <code className="bg-blue-900/50 px-1 py-0.5 rounded text-blue-200 mx-1">{`{{dateRange}}`}</code>
                            <code className="bg-blue-900/50 px-1 py-0.5 rounded text-blue-200 mx-1">{`{{loc1_name}}`}</code>
                            ... 以及 loc2/loc3 的 name 和 date。
                         </p>
                     </div>
                 </div>
                 
                 <div className="flex-1 relative bg-slate-950 rounded-xl border border-slate-700 overflow-hidden shadow-inner flex flex-col min-h-[500px]">
                      <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 border-b border-slate-700 flex items-center px-4">
                          <span className="text-xs text-gray-500 font-mono">prompt_template.txt</span>
                      </div>
                      <textarea
                          value={template}
                          onChange={(e) => setTemplate(e.target.value)}
                          className="flex-1 w-full p-6 mt-8 bg-transparent text-gray-300 font-mono text-sm leading-relaxed outline-none resize-none custom-scrollbar"
                          spellCheck="false"
                      />
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

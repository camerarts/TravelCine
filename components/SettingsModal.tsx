import React, { useState, useEffect } from 'react';
import { DEFAULT_PROMPT_TEMPLATE } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: string;
  onSaveTemplate: (newTemplate: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, currentTemplate, onSaveTemplate 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [template, setTemplate] = useState(currentTemplate);
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Don't reset auth state to allow re-opening without login if needed? 
      // Requirement says "Click settings, enter password". Implying every time? 
      // Or just session? Let's keep session auth for UX, but prompt said "Click... enter password".
      // Let's reset auth on open to strictly follow "Enter password, default 123" instruction.
      setIsAuthenticated(false);
      setPassword('');
      setError('');
      setTemplate(currentTemplate);
    }
  }, [isOpen, currentTemplate]);

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
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('确定要恢复默认提示词吗？您的修改将丢失。')) {
      setTemplate(DEFAULT_PROMPT_TEMPLATE);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-cine-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cine-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            后台提示词设置
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6 py-12">
              <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-full max-w-sm">
                <h3 className="text-center text-white mb-6 font-medium">请输入管理员密码</h3>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="密码"
                      autoFocus
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cine-gold focus:border-transparent outline-none text-white text-center tracking-widest"
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <button
                    type="submit"
                    className="w-full py-3 bg-cine-gold text-cine-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    解锁
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-4 h-full flex flex-col">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-2">
                <h4 className="text-yellow-500 font-bold text-sm mb-1">变量说明</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  请保留以下变量以确保正确注入用户数据：
                  <span className="text-gray-300 font-mono mx-1">{`{{title}}`}</span>
                  <span className="text-gray-300 font-mono mx-1">{`{{englishTitle}}`}</span>
                  <span className="text-gray-300 font-mono mx-1">{`{{dateRange}}`}</span>
                  <span className="text-gray-300 font-mono mx-1">{`{{loc1_name}}`}</span>
                  <span className="text-gray-300 font-mono mx-1">{`{{loc1_date}}`}</span>
                  ...以及 loc2_name, loc2_date, loc3_name, loc3_date
                </p>
              </div>
              
              <div className="flex-1 relative">
                <textarea
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full h-full p-4 bg-slate-950 text-gray-300 font-mono text-xs leading-relaxed border border-slate-700 rounded-lg focus:ring-1 focus:ring-cine-gold outline-none resize-none custom-scrollbar"
                  spellCheck="false"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && (
          <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/50 flex justify-between items-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              恢复默认
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-cine-gold hover:bg-yellow-400 text-cine-900 rounded-lg transition-colors text-sm font-bold shadow-lg shadow-yellow-500/20"
              >
                保存修改
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
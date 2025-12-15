import React from 'react';

interface InputGroupProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  variableHint?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, id, type = "text", value, onChange, placeholder, required = false, className = "", variableHint 
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium text-gray-300">
          {label}
        </label>
        {variableHint && (
          <code className="text-[10px] font-mono text-cine-gold/70 bg-cine-gold/10 px-1.5 py-0.5 rounded border border-cine-gold/10 select-all" title="对应后台模板变量">
            {variableHint}
          </code>
        )}
      </div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        // color-scheme property forces the browser date picker to match the dark theme
        style={type === 'date' ? { colorScheme: 'dark' } : {}}
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cine-gold focus:border-transparent outline-none text-white placeholder-gray-500 transition-all duration-200 hover:border-slate-500"
      />
    </div>
  );
};

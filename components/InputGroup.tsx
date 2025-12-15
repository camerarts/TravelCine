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
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, id, type = "text", value, onChange, placeholder, required = false, className = "" 
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-300">
        {label}
      </label>
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

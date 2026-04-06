import { useState } from 'react';
import { X } from 'react-feather';

const TagInput = ({ label, value = [], onChange, placeholder = 'Type and press Enter', error, className = '' }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = input.trim();
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">{label}</label>
      )}
      <div
        className={`flex flex-wrap gap-2 p-2.5 bg-gray-800/50 border rounded-lg min-h-[42px] transition-all duration-200
          focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-violet-500
          ${error ? 'border-red-500/50' : 'border-gray-700 hover:border-gray-600'}`}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-600/20 border border-violet-500/30 
              text-violet-300 text-xs font-medium rounded-md group"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-violet-100 transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-gray-200 text-sm placeholder-gray-500 
            outline-none border-none"
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default TagInput;

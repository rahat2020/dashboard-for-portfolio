const ToggleSwitch = ({ label, checked, onChange, disabled = false, size = 'md', className = '' }) => {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'h-3 w-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'h-5 w-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'h-6 w-6', translate: 'translate-x-7' },
  };

  const s = sizes[size];

  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`${s.track} rounded-full transition-colors duration-200 
            ${checked ? 'bg-violet-600' : 'bg-gray-700'} 
            peer-focus:ring-2 peer-focus:ring-violet-500/50`}
        />
        <div
          className={`absolute top-0.5 left-0.5 ${s.thumb} bg-white rounded-full shadow-md 
            transition-transform duration-200 ${checked ? s.translate : 'translate-x-0'}`}
        />
      </div>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  );
};

export default ToggleSwitch;

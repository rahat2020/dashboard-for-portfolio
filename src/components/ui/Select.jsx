const Select = ({
  label,
  name,
  options = [],
  register,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-gray-800/50 border rounded-lg text-gray-200 
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
          appearance-none cursor-pointer
          ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-700 hover:border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25em 1.25em',
        }}
        {...(register ? register(name) : {})}
        {...props}
      >
        <option value="" className="bg-gray-800 text-gray-400">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-800 text-gray-200">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Select;

const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  icon,
  rightElement,
  required = false,
  disabled = false,
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
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-violet-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} ${rightElement ? 'pr-10' : ''} py-2.5 bg-gray-900/50 border rounded-lg text-gray-200 placeholder-gray-500 
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
            ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-800 hover:border-gray-700'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          {...(register ? register(name) : {})}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors z-10 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {typeof error === 'string' ? error : error.message}
        </p>
      )}
    </div>
  );
};

export default FormInput;

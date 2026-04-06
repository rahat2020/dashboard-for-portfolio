const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
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
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-gray-800/50 border rounded-lg text-gray-200 placeholder-gray-500 
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
          ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-700 hover:border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...(register ? register(name) : {})}
        {...props}
      />
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

export default FormInput;

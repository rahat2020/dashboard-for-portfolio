const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  onClick,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500 shadow-lg shadow-violet-500/20',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg shadow-red-500/20',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-400 hover:text-gray-200 focus:ring-gray-600',
    outline: 'border border-gray-600 hover:border-violet-500 text-gray-300 hover:text-violet-400 focus:ring-violet-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-lg shadow-emerald-500/20',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'xs' ? 14 : size === 'sm' ? 15 : 16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;

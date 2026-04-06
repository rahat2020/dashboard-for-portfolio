const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-2 border-gray-700 border-t-violet-500 animate-spin`} />
      </div>
    </div>
  );
};

export default Loader;

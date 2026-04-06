import { useState, useRef } from 'react';
import { Upload, X, Image } from 'react-feather';

const ImageUpload = ({ label, value, onChange, error, className = '' }) => {
  const [preview, setPreview] = useState(value || '');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange?.(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleRemove = () => {
    setPreview('');
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">{label}</label>
      )}
      {preview ? (
        <div className="relative group rounded-lg overflow-hidden border border-gray-700">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${dragActive ? 'border-violet-500 bg-violet-500/5' : 'border-gray-700 hover:border-gray-600'}
            ${error ? 'border-red-500/50' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
              {dragActive ? <Upload size={20} className="text-violet-400" /> : <Image size={20} className="text-gray-500" />}
            </div>
            <div>
              <p className="text-sm text-gray-300">
                <span className="text-violet-400 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default ImageUpload;

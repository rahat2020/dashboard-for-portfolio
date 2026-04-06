import { AlertTriangle } from 'react-feather';
import Button from './Button';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 animate-modal-in p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {title || 'Are you sure?'}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            {message || 'This action cannot be undone.'}
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} className="flex-1" loading={loading}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

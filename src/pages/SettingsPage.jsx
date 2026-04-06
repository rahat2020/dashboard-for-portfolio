import { Settings as SettingsIcon } from 'react-feather';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm">Update your account and application preferences.</p>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
          <SettingsIcon size={28} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-300">Settings Section</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1">
          This feature is currently under development. You will soon be able to manage profile, API keys, and theme preferences here.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;

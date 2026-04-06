import { Inbox } from 'react-feather';

const EmptyState = ({ message = 'No data found', description, icon: Icon = Inbox, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-500" />
      </div>
      <h3 className="text-base font-medium text-gray-300 mb-1">{message}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;

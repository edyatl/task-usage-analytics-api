import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface Props {
  message: string;
  onRetry?: () => void;
}

const UsageStatsError = ({ message, onRetry }: Props) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 p-4 rounded-lg flex flex-col items-center">
        <ExclamationTriangleIcon className="w-6 h-6 mb-2" />
        <p>{message}</p>
        {onRetry && (
          <button
            className="bg-red-600 dark:bg-red-400 text-white rounded-lg px-4 py-2 mt-2 hover:bg-red-700 dark:hover:bg-red-300"
            onClick={onRetry}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default UsageStatsError;

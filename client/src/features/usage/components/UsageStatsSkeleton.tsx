const UsageStatsSkeleton = () => {
  return (
    <div>
      <div className="flex flex-wrap justify-around mb-4 md:flex-nowrap">
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
      </div>
      <div className="mb-4">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
      </div>
      <div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
};

export default UsageStatsSkeleton;

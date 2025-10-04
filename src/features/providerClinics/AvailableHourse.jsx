function AvailableHourse({
  availableHours,
  handleTimeChange,
  isLoading,
  availableHoursError,
}) {
  return (
    <div className="mt-6 w-full max-w-md">
      <h4 className="text-lg font-medium text-gray-700 mb-3 text-center">
        Available Hours
      </h4>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={availableHours?.startTime}
              onChange={(e) => handleTimeChange("startTime", e.target.value)}
              disabled={isLoading}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={availableHours.endTime}
              onChange={(e) => handleTimeChange("endTime", e.target.value)}
              disabled={isLoading}
              className="input"
            />
          </div>
        </div>
        {availableHoursError && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {availableHoursError}
          </p>
        )}
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">
            Selected: {availableHours?.startTime} - {availableHours?.endTime}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AvailableHourse;

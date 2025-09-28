function StepIndicator({currentStep, totalSteps, steps}) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isCurrent
                    ? "bg-blue-100 border-primary text-primary"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}>
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>

              {/* Connector Line */}
              {stepNumber < totalSteps && (
                <div
                  className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;

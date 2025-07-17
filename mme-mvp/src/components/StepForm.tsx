import type { FC } from "react";
import { useState, useEffect } from "react";
import Button from "./common/Button";
import type { Step } from "../types/stepType";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";
const StepForm: FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [step: number]: string | string[] }>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchSteps = async () => {
      const res = await fetch("/steps.json");
      const data = await res.json();
      setSteps(data.steps);
    };

    fetchSteps();
  }, []);

  const currentStep = steps[currentStepIndex];

  if (steps.length === 0) return <p>Loading...</p>;
  if (submitted) {
    return (
      <div className="w-full text-center p-10">
        <h2 className="text-4xl font-semibold text-purple-400 mb-4">
          🎉 Thank you!
        </h2>
        <p className="text-gray-500">
          Your form has been submitted successfully.
        </p>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Storing answers in backend
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); // 🔐 JWT token from localStorage

      // ✅ Use 'responses' instead of redefining 'answers'
      const responses = steps.map((step) => ({
        stepNumber: step.stepNumber,
        stepTitle: step.stepTitle,
        question: step.question,
        answer: answers[step.stepNumber] || null,
      }));

      const res = await fetch("http://localhost:8000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ responses }), // ✅ match backend key
      });

      console.log(responses);
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Submission failed");
      }

      showSuccessToast("Form submitted successfully!");
      setSubmitted(true);
    } catch (error: any) {
      console.error("Submit Error:", error.message);
      showErrorToast("Submission failed. Please try again.");
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      console.log("Going back to step:", currentStepIndex - 1);
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      console.log("Back is disabled, current step is 0");
    }
  };

  const renderField = () => {
    const value = answers[currentStep.stepNumber] || "";
    switch (currentStep.type) {
      case "radio":
        return (
          <div className="flex flex-col gap-4">
            {currentStep.options?.map((option) => {
              const isChecked = value === option.value;

              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 p-3 rounded-[10px] cursor-pointer transition-all
              ${
                isChecked
                  ? "border-violet-600"
                  : "border-gray-700 hover:border-violet-600"
              }`}
                >
                  <span
                    className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-colors
                ${
                  isChecked
                    ? "border-violet-600 bg-violet-400"
                    : "border-gray-500"
                }`}
                  >
                    {isChecked && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </span>

                  <input
                    type="radio"
                    name={`step-${currentStep.stepNumber}`}
                    value={option.value}
                    checked={isChecked}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentStep.stepNumber]: e.target.value,
                      }))
                    }
                    className="hidden"
                  />

                  <span className="text-white">{option.label}</span>
                </label>
              );
            })}
          </div>
        );
      case "select":
        return (
          <select
            value={value}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [currentStep.stepNumber]: e.target.value,
              }))
            }
            className="w-full p-3 border border-slate-900 bg-gray-950 rounded-md outline-none text-white focus:ring-2 focus:ring-violet-600"
          >
            {currentStep.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="text-white bg-[#0f0f20] hover:bg-violet-600"
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multi-select":
        const selectedValues = Array.isArray(value) ? value : [];

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentStep.options?.map((option) => {
              const isChecked = selectedValues.includes(option.value);

              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all
              ${
                isChecked
                  ? "border-violet-600"
                  : " border-gray-900 hover:border-violet-600"
              }`}
                >
                  <div
                    className={`w-5 h-5 flex items-center justify-center rounded-sm border-2 transition-all
                ${
                  isChecked
                    ? "border-violet-600 bg-violet-600"
                    : "border-gray-500"
                }`}
                  >
                    {isChecked && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    value={option.value}
                    checked={isChecked}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v) => v !== option.value);

                      setAnswers((prev) => ({
                        ...prev,
                        [currentStep.stepNumber]: newValues,
                      }));
                    }}
                    className="hidden"
                  />

                  <span className="text-white">{option.label}</span>
                </label>
              );
            })}
          </div>
        );

      case "textarea":
        return (
          <textarea
            rows={8}
            className="w-full p-2 border border-gray-800 rounded outline-none"
            placeholder="Type your answer..."
            value={value}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [currentStep.stepNumber]: e.target.value,
              }))
            }
          />
        );
      default:
        return null;
    }
  };
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="w-[70%] mx-auto border border-gray-800 p-10 rounded-[30px] shadow-md bg-[#030014]">
      {/* Progress  */}
      <div className="w-full bg-gray-800 rounded-full h-1 mb-10 overflow-hidden">
        <div
          className="bg-purple-600 h-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <h2 className="text-xl font-semibold mb-2">
        Step {currentStep.stepNumber}: {currentStep.stepTitle}
      </h2>
      <p className="mb-10 text-gray-500">{currentStep.question}</p>

      <div className="input-field mb-8">
        <div className="space-y-4">{renderField()}</div>
      </div>

      <div className="flex justify-between mt-20">
        <Button
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          className="px-12 py-2 bg-red-700 text-white text-sm rounded hover:bg-red-800 disabled:opacity-50 shadow-red-800"
        >
          Back
        </Button>
        <Button
          onClick={
            currentStepIndex === steps.length - 1 ? handleSubmit : handleNext
          }
          className="px-12 py-2 text-white text-sm rounded disabled:opacity-50"
        >
          {currentStepIndex === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default StepForm;

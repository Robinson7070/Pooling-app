"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/authContext";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { usePollContext } from "../../lib/pollContext";
import { useState, useEffect, useMemo } from "react";

export default function CreatePollPage() {
  const { createPoll } = usePollContext();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [optionErrors, setOptionErrors] = useState<string[]>(["", ""]);

  const TITLE_MIN_LENGTH = 10;
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 250;
  const OPTION_MIN_LENGTH = 3;
  const OPTION_MAX_LENGTH = 50;
  const MIN_OPTIONS = 2;
  const MAX_OPTIONS = 10;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Derived state for form validity
  const isFormValid = useMemo(() => {
    const isTitleValid = title.length >= TITLE_MIN_LENGTH && title.length <= TITLE_MAX_LENGTH;
    const areOptionsValid = options.length >= MIN_OPTIONS && options.every(
      (opt, idx) => opt.length >= OPTION_MIN_LENGTH && opt.length <= OPTION_MAX_LENGTH && opt.trim() !== ""
    );
    return isTitleValid && areOptionsValid;
  }, [title, options]);

  const validateField = (fieldName: string, value: string, index?: number) => {
    let error: string | null = null;
    switch (fieldName) {
      case "title":
        if (value.trim() === "") error = "Poll title is required.";
        else if (value.length < TITLE_MIN_LENGTH) error = `Title must be at least ${TITLE_MIN_LENGTH} characters.`;
        else if (value.length > TITLE_MAX_LENGTH) error = `Title cannot exceed ${TITLE_MAX_LENGTH} characters.`;
        setTitleError(error);
        break;
      case "description":
        if (value.length > DESCRIPTION_MAX_LENGTH) error = `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`;
        setDescriptionError(error);
        break;
      case "option":
        const newOptionErrors = [...optionErrors];
        if (value.trim() === "") newOptionErrors[index!] = "Option cannot be empty.";
        else if (value.length < OPTION_MIN_LENGTH) newOptionErrors[index!] = `Option must be at least ${OPTION_MIN_LENGTH} characters.`;
        else if (value.length > OPTION_MAX_LENGTH) newOptionErrors[index!] = `Option cannot exceed ${OPTION_MAX_LENGTH} characters.`;
        else newOptionErrors[index!] = "";
        setOptionErrors(newOptionErrors);
        break;
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    validateField("title", value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    validateField("description", value);
  };

  const handleOptionChange = (idx: number, value: string) => {
    setOptions((opts) => {
      const newOpts = opts.map((opt, i) => (i === idx ? value : opt));
      return newOpts;
    });
    validateField("option", value, idx);
  };

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions((opts) => [...opts, ""]);
      setOptionErrors((errs) => [...errs, ""]);
    }
  };

  const removeOption = (idx: number) => {
    if (options.length > MIN_OPTIONS) {
      setOptions((opts) => opts.filter((_, i) => i !== idx));
      setOptionErrors((errs) => errs.filter((_, i) => i !== idx));
    }
  };

  const handleClearForm = () => {
    setTitle("");
    setDescription("");
    setOptions(["", ""]);
    setMessage(null);
    setTitleError(null);
    setDescriptionError(null);
    setOptionErrors(["", ""]);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    // Re-validate all fields on submit
    validateField("title", title);
    validateField("description", description);
    options.forEach((opt, idx) => validateField("option", opt, idx));

    if (!isFormValid) {
      setMessage({ type: "error", text: "Please correct the errors in the form." });
      setIsSubmitting(false);
      return;
    }

    try {
      await createPoll(title, description, options.filter(Boolean));
      setMessage({ type: "success", text: "Poll created successfully!" });
      handleClearForm(); // Clear form on successful submission
    } catch (error: any) {
      setMessage({ type: "error", text: `Failed to create poll: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <h2 className="text-3xl font-bold text-center text-gray-800">Create a New Poll</h2>
          <p className="text-center text-gray-600">Design your poll with engaging questions and clear options.</p>
        </CardHeader>
        <CardContent>
          {message && (
            <div
              className={`p-3 mb-4 rounded-md text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              role="alert"
            >
              {message.text}
            </div>
          )}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Poll Title */}
            <div>
              <label htmlFor="poll-title" className="block text-sm font-medium text-gray-700 mb-1">Poll Title <span className="text-red-500">*</span></label>
              <input
                id="poll-title"
                type="text"
                placeholder="e.g., What's your favorite programming language?"
                className={`border rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${titleError ? "border-red-500" : "border-gray-300"}`}
                value={title}
                onChange={handleTitleChange}
                onBlur={() => validateField("title", title)}
                minLength={TITLE_MIN_LENGTH}
                maxLength={TITLE_MAX_LENGTH}
                aria-invalid={!!titleError}
                aria-describedby="title-error"
              />
              <div className="flex justify-between items-center text-xs mt-1">
                {titleError && <p id="title-error" className="text-red-500">{titleError}</p>}
                <p className={`ml-auto ${title.length > TITLE_MAX_LENGTH ? "text-red-500" : "text-gray-500"}`}>{title.length}/{TITLE_MAX_LENGTH}</p>
              </div>
            </div>

            {/* Poll Description */}
            <div>
              <label htmlFor="poll-description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                id="poll-description"
                placeholder="Provide more context or details for your poll..."
                className={`border rounded px-4 py-2 w-full h-24 resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${descriptionError ? "border-red-500" : "border-gray-300"}`}
                value={description}
                onChange={handleDescriptionChange}
                onBlur={() => validateField("description", description)}
                maxLength={DESCRIPTION_MAX_LENGTH}
                aria-invalid={!!descriptionError}
                aria-describedby="description-error"
              />
              <div className="flex justify-between items-center text-xs mt-1">
                {descriptionError && <p id="description-error" className="text-red-500">{descriptionError}</p>}
                <p className={`ml-auto ${description.length > DESCRIPTION_MAX_LENGTH ? "text-red-500" : "text-gray-500"}`}>{description.length}/{DESCRIPTION_MAX_LENGTH}</p>
              </div>
            </div>

            {/* Poll Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poll Options <span className="text-red-500">*</span></label>
              <div className="flex flex-col gap-3">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    {/* Drag handle placeholder */}
                    <span className="text-gray-400 cursor-grab active:cursor-grabbing hidden group-hover:block" title="Drag to reorder">
                      &#x2261;
                    </span>
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      className={`border rounded px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${optionErrors[idx] ? "border-red-500" : "border-gray-300"}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      onBlur={() => validateField("option", opt, idx)}
                      minLength={OPTION_MIN_LENGTH}
                      maxLength={OPTION_MAX_LENGTH}
                      aria-invalid={!!optionErrors[idx]}
                      aria-describedby={`option-${idx}-error`}
                    />
                    {options.length > MIN_OPTIONS && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 transition duration-200 p-1 rounded-full hover:bg-red-50"
                        onClick={() => removeOption(idx)}
                        aria-label={`Remove option ${idx + 1}`}
                        title="Remove Option"
                      >
                        &#x2715;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < MAX_OPTIONS && (
                <button
                  type="button"
                  className="mt-3 w-full bg-gray-100 text-gray-700 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={addOption}
                  disabled={options.length >= MAX_OPTIONS}
                >
                  + Add Another Option
                </button>
              )}
              {options.length >= MAX_OPTIONS && (
                <p className="mt-2 text-sm text-gray-500 text-center">Maximum of {MAX_OPTIONS} options reached.</p>
              )}
              {optionErrors.some(err => err !== "") && (
                <p className="text-red-500 text-xs mt-2">Please ensure all options are valid.</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="submit"
                className={`flex-1 bg-blue-600 text-white rounded-md px-6 py-3 font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${(!isFormValid || isSubmitting) ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Poll...
                  </span>
                ) : (
                  "Create Poll"
                )}
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-700 rounded-md px-6 py-3 font-medium hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={handleClearForm}
              >
                Clear Form
              </button>
              <button
                type="button"
                className="flex-1 bg-purple-100 text-purple-700 rounded-md px-6 py-3 font-medium hover:bg-purple-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                onClick={() => alert("Preview functionality not yet implemented!")}
              >
                Preview Poll
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

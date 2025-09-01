'use client';

import React, { useState, useEffect } from 'react';
import { EditPollFormProps, Poll, PollOption, FormMessage } from '../lib/index';

export default function EditPollForm({ poll, onSubmit, onCancel }: EditPollFormProps) {
  const [title, setTitle] = useState(poll.title);
  const [description, setDescription] = useState(poll.description);
  const [options, setOptions] = useState<PollOption[]>(poll.options);
  const [message, setMessage] = useState<FormMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [optionErrors, setOptionErrors] = useState<string[]>(new Array(options.length).fill(''));

  // Constants for validation
  const TITLE_MIN_LENGTH = 10;
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 250;
  const OPTION_MIN_LENGTH = 3;
  const OPTION_MAX_LENGTH = 50;
  const MIN_OPTIONS = 2;
  const MAX_OPTIONS = 10;

  // Validate form fields
  const validateField = (field: 'title' | 'description' | 'option', value: string, idx?: number) => {
    switch (field) {
      case 'title':
        if (!value.trim()) {
          setTitleError('Title is required');
          return false;
        } else if (value.length < TITLE_MIN_LENGTH) {
          setTitleError(`Title must be at least ${TITLE_MIN_LENGTH} characters`);
          return false;
        } else if (value.length > TITLE_MAX_LENGTH) {
          setTitleError(`Title must be less than ${TITLE_MAX_LENGTH} characters`);
          return false;
        } else {
          setTitleError(null);
          return true;
        }
      
      case 'description':
        if (value.length > DESCRIPTION_MAX_LENGTH) {
          setDescriptionError(`Description must be less than ${DESCRIPTION_MAX_LENGTH} characters`);
          return false;
        } else {
          setDescriptionError(null);
          return true;
        }
      
      case 'option':
        if (idx === undefined) return false;
        
        const newErrors = [...optionErrors];
        
        if (!value.trim()) {
          newErrors[idx] = 'Option text is required';
          setOptionErrors(newErrors);
          return false;
        } else if (value.length < OPTION_MIN_LENGTH) {
          newErrors[idx] = `Option must be at least ${OPTION_MIN_LENGTH} characters`;
          setOptionErrors(newErrors);
          return false;
        } else if (value.length > OPTION_MAX_LENGTH) {
          newErrors[idx] = `Option must be less than ${OPTION_MAX_LENGTH} characters`;
          setOptionErrors(newErrors);
          return false;
        } else {
          newErrors[idx] = '';
          setOptionErrors(newErrors);
          return true;
        }
      
      default:
        return false;
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const isTitleValid = title.length >= TITLE_MIN_LENGTH && title.length <= TITLE_MAX_LENGTH;
    const isDescriptionValid = description.length <= DESCRIPTION_MAX_LENGTH;
    const areOptionsValid = options.length >= MIN_OPTIONS && 
      options.every(opt => opt.text.length >= OPTION_MIN_LENGTH && opt.text.length <= OPTION_MAX_LENGTH);
    
    return isTitleValid && isDescriptionValid && areOptionsValid;
  };

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    validateField('title', value);
  };

  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    validateField('description', value);
  };

  // Handle option text change
  const handleOptionChange = (idx: number, value: string) => {
    setOptions(prev => {
      const newOptions = [...prev];
      newOptions[idx] = { ...newOptions[idx], text: value };
      return newOptions;
    });
    validateField('option', value, idx);
  };

  // Add a new option
  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions(prev => [...prev, { id: `new-${Date.now()}`, text: '', votes: 0 }]);
      setOptionErrors(prev => [...prev, '']);
    }
  };

  // Remove an option
  const removeOption = (idx: number) => {
    if (options.length > MIN_OPTIONS) {
      setOptions(prev => prev.filter((_, i) => i !== idx));
      setOptionErrors(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Re-validate all fields
    validateField('title', title);
    validateField('description', description);
    options.forEach((opt, idx) => validateField('option', opt.text, idx));

    if (!isFormValid()) {
      setMessage({
        type: 'error',
        text: 'Please correct the errors in the form.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create updated poll object
      const updatedPoll: Poll = {
        ...poll,
        title,
        description,
        options
      };

      // Submit the updated poll
      onSubmit(updatedPoll);
      
      setMessage({
        type: 'success',
        text: 'Poll updated successfully!'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setMessage({
        type: 'error',
        text: `Failed to update poll: ${errorMessage}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {message && (
          <div
            className={`p-3 mb-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        {/* Poll Title */}
        <div>
          <label htmlFor="poll-title" className="block text-sm font-medium text-gray-700 mb-1">
            Poll Title <span className="text-red-500">*</span>
          </label>
          <input
            id="poll-title"
            type="text"
            placeholder="e.g., What's your favorite programming language?"
            className={`border rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${titleError ? 'border-red-500' : 'border-gray-300'}`}
            value={title}
            onChange={handleTitleChange}
            onBlur={() => validateField('title', title)}
            minLength={TITLE_MIN_LENGTH}
            maxLength={TITLE_MAX_LENGTH}
            aria-invalid={!!titleError}
            aria-describedby="title-error"
            required
          />
          <div className="flex justify-between items-center text-xs mt-1">
            {titleError && <p id="title-error" className="text-red-500">{titleError}</p>}
            <p className={`ml-auto ${title.length > TITLE_MAX_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
              {title.length}/{TITLE_MAX_LENGTH}
            </p>
          </div>
        </div>

        {/* Poll Description */}
        <div>
          <label htmlFor="poll-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="poll-description"
            placeholder="Provide more context or details for your poll..."
            className={`border rounded px-4 py-2 w-full h-24 resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${descriptionError ? 'border-red-500' : 'border-gray-300'}`}
            value={description}
            onChange={handleDescriptionChange}
            onBlur={() => validateField('description', description)}
            maxLength={DESCRIPTION_MAX_LENGTH}
            aria-invalid={!!descriptionError}
            aria-describedby="description-error"
          />
          <div className="flex justify-between items-center text-xs mt-1">
            {descriptionError && <p id="description-error" className="text-red-500">{descriptionError}</p>}
            <p className={`ml-auto ${description.length > DESCRIPTION_MAX_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </p>
          </div>
        </div>

        {/* Poll Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Options <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  className={`border rounded px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${optionErrors[idx] ? 'border-red-500' : 'border-gray-300'}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  onBlur={() => validateField('option', opt.text, idx)}
                  minLength={OPTION_MIN_LENGTH}
                  maxLength={OPTION_MAX_LENGTH}
                  aria-invalid={!!optionErrors[idx]}
                  aria-describedby={`option-${idx}-error`}
                  required
                />
                <div className="text-xs text-gray-500 min-w-[80px]">
                  Votes: {opt.votes}
                </div>
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
            {optionErrors.some(err => err !== '') && (
              <p className="text-red-500 text-xs mt-1">Please ensure all options are valid.</p>
            )}
          </div>
          {options.length < MAX_OPTIONS && (
            <button
              type="button"
              className="mt-3 w-full bg-gray-100 text-gray-700 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={addOption}
            >
              + Add Another Option
            </button>
          )}
          {options.length >= MAX_OPTIONS && (
            <p className="mt-2 text-sm text-gray-500 text-center">Maximum of {MAX_OPTIONS} options reached.</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            type="submit"
            className={`flex-1 bg-blue-600 text-white rounded-md px-6 py-3 font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${(!isFormValid() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Poll...
              </span>
            ) : (
              'Update Poll'
            )}
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-200 text-gray-700 rounded-md px-6 py-3 font-medium hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
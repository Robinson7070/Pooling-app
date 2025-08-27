"use client";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { usePollContext } from "../../lib/pollContext";
import { useState } from "react";

export default function CreatePollPage() {
  const { createPoll, user } = usePollContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [message, setMessage] = useState("");

  const handleOptionChange = (idx: number, value: string) => {
    setOptions((opts) => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const addOption = () => setOptions((opts) => [...opts, ""]);
  const removeOption = (idx: number) => setOptions((opts) => opts.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || options.filter(Boolean).length < 2) {
      setMessage("Please enter a title and at least two options.");
      return;
    }
    createPoll(title, description, options.filter(Boolean));
    setTitle("");
    setDescription("");
    setOptions(["", ""]);
    setMessage("Poll created!");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-xl font-bold mb-2">Create a New Poll</h2>
          </CardHeader>
          <CardContent>
            <div className="text-red-500">You must be logged in to create a poll.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-bold mb-2">Create a New Poll</h2>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Poll Title"
              className="border rounded px-3 py-2"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Poll Description"
              className="border rounded px-3 py-2"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    className="border rounded px-3 py-2 flex-1"
                    value={opt}
                    onChange={e => handleOptionChange(idx, e.target.value)}
                  />
                  {options.length > 2 && (
                    <button type="button" className="text-red-500" onClick={() => removeOption(idx)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="bg-gray-200 rounded px-2 py-1 mt-2" onClick={addOption}>
                Add Option
              </button>
            </div>
            <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold">Create Poll</button>
          </form>
          {message && <div className="mt-2 text-green-600 text-sm">{message}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";

type Props = {
  onConfirm: (interviewDate: string) => void;
  onCancel: () => void;
};

const InterviewModal = ({ onConfirm, onCancel }: Props) => {
  const [dateTime, setDateTime] = useState("");

  const handleSubmit = () => {
    if (!dateTime) return alert("Please select a date and time.");

    const iso = new Date(dateTime).toISOString();
    onConfirm(iso);
  };

  return (
    <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">
          Set Interview Date & Time
        </h2>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewModal;

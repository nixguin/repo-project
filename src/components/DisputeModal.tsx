import { useEffect, useRef, useState } from "react";

interface Props {
  matchId: string;
  onClose: () => void;
}

export default function DisputeModal({ matchId, onClose }: Props) {
  const WINDOW_SECONDS = 30 * 60; // 30-minute challenge window — REQ-07
  const [remaining, setRemaining] = useState(WINDOW_SECONDS);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  const minutes = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");
  const expired = remaining === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-cobalt">File a Dispute</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-1">
          Match ID: <span className="text-gray-700 font-mono">{matchId}</span>
        </p>

        {/* Countdown timer */}
        <div
          className={`flex items-center gap-2 mb-5 mt-3 p-3 rounded-lg border ${expired ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}
        >
          <span className="text-sm text-gray-600">Challenge window:</span>
          <span
            className={`font-mono font-bold text-lg ${expired ? "text-red-500" : "text-yellow-600"}`}
          >
            {minutes}:{seconds}
          </span>
          {expired && (
            <span className="text-red-500 text-xs ml-auto">Window closed</span>
          )}
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-green-700 text-sm text-center">
            ✓ Dispute submitted. The organizer has been notified.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Reason / Notes
              </label>
              <textarea
                rows={3}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={expired}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-fgcu-emerald disabled:opacity-50 resize-none"
                placeholder="Describe the issue…"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Evidence (screenshot URL or description)
              </label>
              <input
                type="text"
                disabled={expired}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-fgcu-emerald disabled:opacity-50"
                placeholder="https://i.imgur.com/…"
              />
            </div>
            <button
              type="submit"
              disabled={expired}
              className="w-full bg-cobalt hover:bg-cobalt-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white font-semibold py-2.5 rounded-lg text-sm"
            >
              Submit Dispute
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

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

  const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");
  const expired = remaining === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-white">Dispute Match Result</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>

        <p className="text-xs text-gray-500 mb-1">Match ID: <span className="text-gray-300">{matchId}</span></p>

        {/* Countdown timer */}
        <div className={`flex items-center gap-2 mb-5 mt-3 p-3 rounded-lg ${expired ? "bg-red-900/30 border border-red-700" : "bg-yellow-900/20 border border-yellow-700"}`}>
          <span className="text-sm text-gray-400">Challenge window:</span>
          <span className={`font-mono font-bold text-lg ${expired ? "text-red-400" : "text-yellow-400"}`}>
            {minutes}:{seconds}
          </span>
          {expired && <span className="text-red-400 text-xs ml-auto">Window closed</span>}
        </div>

        {submitted ? (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-green-400 text-sm text-center">
            ✓ Dispute submitted. The organizer has been notified.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Reason / Notes</label>
              <textarea
                rows={3}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={expired}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 disabled:opacity-50 resize-none"
                placeholder="Describe the issue…"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Evidence (screenshot URL or description)</label>
              <input
                type="text"
                disabled={expired}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                placeholder="https://i.imgur.com/…"
              />
            </div>
            <button
              type="submit"
              disabled={expired}
              className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white font-semibold py-2.5 rounded-lg text-sm"
            >
              Submit Dispute
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

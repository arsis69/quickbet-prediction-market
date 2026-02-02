import { useState } from 'react';

interface CreateMarketProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (question: string, endTime: number) => Promise<void>;
  loading: boolean;
}

export function CreateMarket({ isOpen, onClose, onCreate, loading }: CreateMarketProps) {
  const [question, setQuestion] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !endDate) return;

    const endTime = new Date(endDate).getTime();
    await onCreate(question, endTime);
    setQuestion('');
    setEndDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold">Create Market</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Will Bitcoin reach $100k by end of 2024?"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              End Date
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !question.trim() || !endDate}
              className="flex-1 btn-gradient text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Market'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Star, Send, CheckCircle2 } from 'lucide-react';
import { CONTACT_INFO } from '../data/studioData';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: { clientName: string; projectType: string; comment: string; rating: number }) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmitFeedback }) => {
  const [clientName, setClientName] = useState('');
  const [projectType, setProjectType] = useState('Web Development');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !comment.trim()) return;

    onSubmitFeedback({
      clientName: clientName.trim(),
      projectType,
      comment: comment.trim(),
      rating,
    });
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#0D111E] border border-[#282D40] rounded-2xl overflow-hidden shadow-2xl flex flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#282D40]">
          <h3 id="feedback-modal-title" className="text-lg font-bold text-white">
            Share Client Feedback
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#858DA2] hover:text-white hover:bg-[#282D40] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#FFA500]/20 flex items-center justify-center text-[#FFA500] mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Thank You for Your Feedback!</h4>
            <p className="text-xs sm:text-sm text-[#B8BDCA] max-w-sm mb-6">
              Your genuine review helps {CONTACT_INFO.brandName} maintain the highest standard of creative and technical excellence.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#FFA500] text-black font-semibold text-sm"
            >
              Back to Studio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-5 space-y-4">
            <p className="text-xs text-[#858DA2]">
              As an authentic studio, we appreciate candid feedback from our clients and collaboration partners.
            </p>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Your Name or Organization *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Adebayo & Co. / Sarah Okon"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121727] border border-[#282D40] text-sm text-white placeholder-[#858DA2] focus:border-[#FFA500] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Project / Service Completed</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121727] border border-[#282D40] text-sm text-white focus:border-[#FFA500] focus:outline-none transition-colors"
              >
                <option value="Web Development">Web Development</option>
                <option value="Software Development">Software Development</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Photography">Photography</option>
                <option value="Videography">Videography</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Social Media Management">Social Media Management</option>
                <option value="IT Support">IT Support</option>
                <option value="Brand Identity">Brand Identity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`${star} star rating`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-[#FFA500] text-[#FFA500]'
                          : 'text-[#282D40] hover:text-[#858DA2]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/90 mb-1.5">Feedback & Experience *</label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience working with KC Digital Studio..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121727] border border-[#282D40] text-sm text-white placeholder-[#858DA2] focus:border-[#FFA500] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[#858DA2] hover:text-white hover:bg-[#282D40] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFA500] hover:bg-[#FFB52E] text-black font-semibold text-xs tracking-wide transition-all shadow-md shadow-[#FFA500]/20"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronDown, Loader2, MessageSquare } from 'lucide-react';

export default function TestimonialFormCard() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      setError('Please add your name and a short message.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        name: trimmedName,
        message: trimmedMessage,
        rating,
        createdAt: serverTimestamp(),
      });
      setName('');
      setMessage('');
      setRating(5);
      setSuccess('Thanks for the kind words!');
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      setError('Unable to submit right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
        aria-controls="testimonial-form"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">Leave a Testimonial</h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {!isOpen && (
        <p className="text-sm text-gray-600 mt-2">
          Tap to share a quick note about your experience.
        </p>
      )}

      {isOpen && (
        <div id="testimonial-form" className="mt-4">
          <p className="text-sm text-gray-600 mb-4">
            Share a quick note about your experience.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Your Name *</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={50}
                required
                className="input-field"
                placeholder="First name is great"
              />
            </div>

            <div>
              <label className="label">Rating *</label>
              <select
                name="rating"
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="input-field"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Great</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Needs Improvement</option>
              </select>
            </div>

            <div>
              <label className="label">Testimonial *</label>
              <textarea
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={500}
                minLength={10}
                required
                rows={4}
                className="input-field"
                placeholder="Write a few sentences about your experience..."
              />
              <p className="text-xs text-gray-500 mt-1">Max 500 characters.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                'Submit Testimonial'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

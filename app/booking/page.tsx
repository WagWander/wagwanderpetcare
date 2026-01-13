'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import type { ServiceType } from '@/types';

const services = [
  { value: 'walk30', label: 'Dog Walk - 30 Minutes ($25)' },
  { value: 'walk60', label: 'Dog Walk - 60 Minutes ($40)' },
  { value: 'homeVisit', label: 'Home Visit - Any Animal ($75)' },
];

export default function BookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    clientPhone: '',
    serviceType: '' as ServiceType,
    date: '',
    timeWindow: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'requests'), {
        clientPhone: formData.clientPhone,
        serviceType: formData.serviceType,
        date: formData.date,
        timeWindow: formData.timeWindow,
        notes: formData.notes,
        status: 'pending',
        createdAt: serverTimestamp(),
        clientId: '', // Will be linked by admin
        petIds: [], // Will be linked by admin
      });

      router.push('/booking/success');
    } catch (err) {
      console.error('Error submitting booking request:', err);
      setError('Failed to submit booking request. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Book a Service</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Request</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Your Phone Number *</label>
                <input
                  type="tel"
                  name="clientPhone"
                  required
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 (555) 123-4567"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We&apos;ll use this to match your request with your client profile
                </p>
              </div>

              <div>
                <label className="label">Service Type *</label>
                <select
                  name="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Preferred Date *</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="label">Time Window *</label>
                <input
                  type="text"
                  name="timeWindow"
                  required
                  value={formData.timeWindow}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 9am-12pm or afternoon"
                />
              </div>

              <div>
                <label className="label">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="input-field"
                  rows={4}
                  placeholder="Any special instructions or requests..."
                />
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                Cancellation Policy
              </h3>
              <p className="text-sm text-yellow-800">
                Please provide at least 12 hours notice for cancellations. Same-day cancellations may be charged in full.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Booking Request'
            )}
          </button>

          <p className="text-sm text-gray-600 text-center">
            Not a client yet?{' '}
            <Link href="/intake" className="text-primary-600 hover:underline">
              Complete the intake form first
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

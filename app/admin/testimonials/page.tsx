'use client';

import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, MessageSquare, Star, Trash2 } from 'lucide-react';
import type { Testimonial } from '@/types';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsRef = collection(db, 'testimonials');
        const q = query(testimonialsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Testimonial[];

        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleDelete = async (testimonialId: string) => {
    const confirmed = window.confirm('Delete this testimonial? This cannot be undone.');
    if (!confirmed) return;

    setDeletingId(testimonialId);
    try {
      await deleteDoc(doc(db, 'testimonials', testimonialId));
      setTestimonials((prev) => prev.filter((item) => item.id !== testimonialId));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating: number) => {
    const safeRating = Math.min(Math.max(rating || 0, 0), 5);
    return Array.from({ length: 5 }, (_, index) => {
      const isFilled = index < safeRating;
      return (
        <Star
          key={index}
          className={`w-4 h-4 ${isFilled ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      );
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-800">Testimonials</h2>
      </div>

      {testimonials.length > 0 ? (
        <div className="space-y-4">
          {testimonials.map((testimonial) => {
            const createdAt = testimonial.createdAt ? testimonial.createdAt.toDate() : null;
            return (
              <div key={testimonial.id} className="card space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{testimonial.name}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(testimonial.rating || 0)}
                    </div>
                    {createdAt && (
                      <p className="text-sm text-gray-500 mt-1">
                        {createdAt.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={deletingId === testimonial.id}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deletingId === testimonial.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
                <p className="text-gray-700">{testimonial.message}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No testimonials yet</p>
        </div>
      )}
    </div>
  );
}

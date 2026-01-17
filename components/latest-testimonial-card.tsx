'use client';

import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, MessageSquare, Star } from 'lucide-react';
import type { Testimonial } from '@/types';

export default function LatestTestimonialCard() {
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const createdAt = testimonial?.createdAt ? testimonial.createdAt.toDate() : null;

  useEffect(() => {
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(testimonialsRef, orderBy('createdAt', 'desc'), limit(1));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setTestimonial(null);
        } else {
          const doc = snapshot.docs[0];
          setTestimonial({ id: doc.id, ...(doc.data() as Omit<Testimonial, 'id'>) });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching testimonials:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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

  return (
    <div className="card border-2 border-primary-100">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-800">Latest Testimonial</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      ) : testimonial ? (
        <div className="space-y-3">
          <p className="text-gray-700 italic">
            &ldquo;{testimonial.message}&rdquo;
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{testimonial.name}</p>
              {createdAt && (
                <p className="text-sm text-gray-500">
                  {createdAt.toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {renderStars(testimonial.rating || 0)}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No testimonials yet. Be the first to leave one.</p>
      )}
    </div>
  );
}

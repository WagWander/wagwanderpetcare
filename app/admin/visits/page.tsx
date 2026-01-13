'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, ClipboardList, Plus } from 'lucide-react';
import type { Visit } from '@/types';

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const visitsRef = collection(db, 'visits');
        const q = query(visitsRef, orderBy('completedAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const visitsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Visit[];

        setVisits(visitsData);
      } catch (error) {
        console.error('Error fetching visits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Visits</h2>
        <Link href="/admin/visits/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Visit
        </Link>
      </div>

      {/* Visits List */}
      {visits.length > 0 ? (
        <div className="space-y-3">
          {visits.map((visit) => (
            <Link
              key={visit.id}
              href={`/admin/visits/${visit.id}`}
              className="block card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                {visit.photos.length > 0 && (
                  <img
                    src={visit.photos[0]}
                    alt="Visit"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">
                    {visit.completedAt?.toDate().toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 line-clamp-2">
                    {visit.summaryNotes}
                  </p>
                  {visit.photos.length > 1 && (
                    <p className="text-xs text-gray-500 mt-2">
                      +{visit.photos.length - 1} more photo{visit.photos.length > 2 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No visits recorded yet</p>
          <Link href="/admin/visits/create" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create First Visit
          </Link>
        </div>
      )}
    </div>
  );
}

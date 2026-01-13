'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Loader2, MessageSquare, Image as ImageIcon } from 'lucide-react';
import type { Visit, Request, Client } from '@/types';

export default function VisitDetailPage() {
  const params = useParams();
  const visitId = params.id as string;
  
  const [visit, setVisit] = useState<Visit | null>(null);
  const [request, setRequest] = useState<Request | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch visit
        const visitDoc = await getDoc(doc(db, 'visits', visitId));
        if (visitDoc.exists()) {
          const visitData = { id: visitDoc.id, ...visitDoc.data() } as Visit;
          setVisit(visitData);

          // Fetch related request
          if (visitData.requestId) {
            const requestDoc = await getDoc(doc(db, 'requests', visitData.requestId));
            if (requestDoc.exists()) {
              const requestData = { id: requestDoc.id, ...requestDoc.data() } as Request;
              setRequest(requestData);

              // Fetch client by phone
              const clientsRef = collection(db, 'clients');
              const q = query(clientsRef, where('phone', '==', requestData.clientPhone));
              const clientSnapshot = await getDocs(q);
              
              if (!clientSnapshot.empty) {
                setClient({
                  id: clientSnapshot.docs[0].id,
                  ...clientSnapshot.docs[0].data(),
                } as Client);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching visit data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visitId]);

  const handleSendUpdate = () => {
    if (!client || !visit) return;

    // Create a simple photo gallery URL (this could be enhanced)
    const photoLinks = visit.photos.map((url, i) => `Photo ${i + 1}: ${url}`).join('\n\n');
    
    const message = `Hi ${client.name}! Your pet care visit is complete. ${visit.summaryNotes}\n\nPhotos:\n${photoLinks}`;
    
    const smsUrl = `sms:${client.phone}?&body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Visit not found</p>
        <Link href="/admin/visits" className="btn-primary mt-4 inline-block">
          Back to Visits
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/visits" className="text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Visit Details</h2>
      </div>

      {/* Visit Info */}
      <div className="card">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500">Completed</label>
          <p className="text-gray-800 mt-1">
            {visit.completedAt?.toDate().toLocaleString()}
          </p>
        </div>

        {request && (
          <div className="mb-4 pb-4 border-b">
            <label className="text-sm font-medium text-gray-500">Service Details</label>
            <p className="text-gray-800 mt-1">
              {request.serviceType} on {request.date}
            </p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-500">Visit Summary</label>
          <p className="text-gray-800 mt-2 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
            {visit.summaryNotes}
          </p>
        </div>
      </div>

      {/* Photos */}
      {visit.photos.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Photos ({visit.photos.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {visit.photos.map((photo, index) => (
              <a
                key={index}
                href={photo}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <img
                  src={photo}
                  alt={`Visit photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Send Update */}
      {client && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Send Update to Client
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Send {client.name} an SMS with visit details and photos
          </p>
          <button
            onClick={handleSendUpdate}
            className="btn-primary flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Send SMS Update
          </button>
        </div>
      )}

      {!client && request && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Client profile not found for phone: {request.clientPhone}
          </p>
        </div>
      )}
    </div>
  );
}

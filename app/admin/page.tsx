'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { Loader2, Calendar, CheckCircle, Clock } from 'lucide-react';
import type { Request } from '@/types';

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsRef = collection(db, 'requests');
        const q = query(requestsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const requestsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Request[];

        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');
  const completedRequests = requests.filter((r) => r.status === 'completed');

  const getServiceLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      walk30: 'Walk 30min',
      walk60: 'Walk 60min',
      homeVisit: 'Home Visit',
      homeVisitMedical: 'Home Visit + Medical',
    };
    return labels[serviceType] || serviceType;
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
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-900">{pendingRequests.length}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Approved</h3>
          </div>
          <p className="text-3xl font-bold text-blue-900">{approvedRequests.length}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-green-900">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-green-900">{completedRequests.length}</p>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Pending Requests
          </h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <Link
                key={request.id}
                href={`/admin/requests/${request.id}`}
                className="block bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                      {getServiceLabel(request.serviceType)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{request.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Phone:</strong> {request.clientPhone}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> {request.timeWindow}
                </p>
                {request.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Notes:</strong> {request.notes}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Approved Requests */}
      {approvedRequests.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Approved Requests
          </h3>
          <div className="space-y-3">
            {approvedRequests.slice(0, 5).map((request) => (
              <Link
                key={request.id}
                href={`/admin/requests/${request.id}`}
                className="block bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    {getServiceLabel(request.serviceType)}
                  </span>
                  <span className="text-sm text-gray-600">{request.date}</span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {request.clientPhone}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="card text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No requests yet</p>
        </div>
      )}
    </div>
  );
}

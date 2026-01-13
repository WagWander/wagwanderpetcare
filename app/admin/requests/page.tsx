'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Calendar, Clock, CheckCircle } from 'lucide-react';
import type { Request } from '@/types';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'completed'>('all');

  useEffect(() => {
    fetchRequests();
  }, []);

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

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter((r) => r.status === filter);

  const getServiceLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      walk30: 'Walk 30min',
      walk60: 'Walk 60min',
      homeVisit: 'Home Visit',
      homeVisitMedical: 'Home Visit + Medical',
    };
    return labels[serviceType] || serviceType;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-4 h-4" />,
      approved: <Calendar className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
    };
    return icons[status] || null;
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
      <h2 className="text-2xl font-bold text-gray-800">Booking Requests</h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <Link
              key={request.id}
              href={`/admin/requests/${request.id}`}
              className="block card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded border ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {getServiceLabel(request.serviceType)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {request.date}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Phone:</strong> {request.clientPhone}
                </p>
                <p>
                  <strong>Time:</strong> {request.timeWindow}
                </p>
                {request.notes && (
                  <p className="mt-2 text-gray-700">
                    <strong>Notes:</strong> {request.notes}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            {filter === 'all' ? 'No requests yet' : `No ${filter} requests`}
          </p>
        </div>
      )}
    </div>
  );
}

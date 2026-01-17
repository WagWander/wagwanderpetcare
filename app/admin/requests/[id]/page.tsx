'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Loader2, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import type { Request, RequestStatus } from '@/types';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingAction, setUpdatingAction] = useState<'approve' | 'decline' | 'complete' | null>(null);

  const statusStyles: Record<RequestStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
  };

  const getServiceLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      walk30: 'Dog Walk - 30 Minutes ($25)',
      walk60: 'Dog Walk - 60 Minutes ($40)',
      homeVisit: 'Home Visit - Any Animal ($75)',
      homeVisitMedical: 'Home Visit with Medical ($80)',
    };
    return labels[serviceType] || serviceType;
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const requestDoc = await getDoc(doc(db, 'requests', requestId));
        if (requestDoc.exists()) {
          setRequest({ id: requestDoc.id, ...requestDoc.data() } as Request);
        }
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  const handleApprove = async () => {
    if (!request) return;
    
    setUpdatingAction('approve');
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        status: 'approved',
      });
      setRequest({ ...request, status: 'approved' });
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    } finally {
      setUpdatingAction(null);
    }
  };

  const handleDecline = async () => {
    if (!request) return;

    const confirmed = window.confirm('Decline this booking request?');
    if (!confirmed) return;

    setUpdatingAction('decline');
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        status: 'declined',
      });
      setRequest({ ...request, status: 'declined' });
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Failed to decline request');
    } finally {
      setUpdatingAction(null);
    }
  };

  const handleComplete = async () => {
    if (!request) return;
    
    setUpdatingAction('complete');
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        status: 'completed',
      });
      router.push(`/admin/visits/create?requestId=${requestId}`);
    } catch (error) {
      console.error('Error completing request:', error);
      alert('Failed to complete request');
      setUpdatingAction(null);
    }
  };

  const handleSendDecline = () => {
    if (!request) return;

    const serviceLabel = getServiceLabel(request.serviceType);
    const message =
      `Hi! Thanks for your request for ${serviceLabel} on ${request.date} (${request.timeWindow}). ` +
      'Unfortunately we are not available at that time. ' +
      'Reply with a few alternate dates/times and we will do our best to fit you in.';

    const smsUrl = `sms:${request.clientPhone}?&body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Request not found</p>
        <Link href="/admin/requests" className="btn-primary mt-4 inline-block">
          Back to Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/requests" className="text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Request Details</h2>
      </div>

      {/* Request Info */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[request.status]}`}>
            {request.status.toUpperCase()}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Service</label>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {getServiceLabel(request.serviceType)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Date</label>
              <p className="text-gray-800 mt-1">{request.date}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Time Window</label>
              <p className="text-gray-800 mt-1">{request.timeWindow}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Client Phone</label>
            <p className="text-gray-800 mt-1">
              <a href={`tel:${request.clientPhone}`} className="text-primary-600 hover:underline">
                {request.clientPhone}
              </a>
            </p>
          </div>

          {request.notes && (
            <div>
              <label className="text-sm font-medium text-gray-500">Notes</label>
              <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">
                {request.notes}
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">Submitted</label>
            <p className="text-gray-600 text-sm mt-1">
              {request.createdAt?.toDate().toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
        
        {request.status === 'pending' && (
          <div className="space-y-3">
            <button
              onClick={handleApprove}
              disabled={updatingAction !== null}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {updatingAction === 'approve' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Approve Request
                </>
              )}
            </button>
            <button
              onClick={handleDecline}
              disabled={updatingAction !== null}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingAction === 'decline' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Declining...
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  Decline Request
                </>
              )}
            </button>
          </div>
        )}

        {request.status === 'approved' && (
          <div className="space-y-3">
            <button
              onClick={handleComplete}
              disabled={updatingAction !== null}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {updatingAction === 'complete' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Mark as Completed & Create Visit
                </>
              )}
            </button>
          </div>
        )}

        {request.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">Request Completed</p>
          </div>
        )}

        {request.status === 'declined' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-red-800 font-medium mb-4">Request Declined</p>
            <button
              onClick={handleSendDecline}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Send Decline SMS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ArrowLeft, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import type { Request } from '@/types';

export default function CreateVisitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId') || '';

  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(false);
  const [summaryNotes, setSummaryNotes] = useState('');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (requestId) {
      const fetchRequest = async () => {
        try {
          const requestDoc = await getDoc(doc(db, 'requests', requestId));
          if (requestDoc.exists()) {
            setRequest({ id: requestDoc.id, ...requestDoc.data() } as Request);
          }
        } catch (error) {
          console.error('Error fetching request:', error);
        }
      };
      fetchRequest();
    }
  }, [requestId]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    setPhotoFiles((prev) => [...prev, ...files]);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload photos
      const photoUrls: string[] = [];
      for (const file of photoFiles) {
        const photoRef = ref(storage, `visits/${Date.now()}_${file.name}`);
        await uploadBytes(photoRef, file);
        const photoUrl = await getDownloadURL(photoRef);
        photoUrls.push(photoUrl);
      }

      // Create visit
      const visitData = {
        requestId: requestId || '',
        summaryNotes,
        photos: photoUrls,
        completedAt: serverTimestamp(),
      };

      const visitRef = await addDoc(collection(db, 'visits'), visitData);
      
      router.push(`/admin/visits/${visitRef.id}`);
    } catch (error) {
      console.error('Error creating visit:', error);
      alert('Failed to create visit. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/visits" className="text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Create Visit Record</h2>
      </div>

      {request && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Request:</strong> {request.serviceType} on {request.date} for {request.clientPhone}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="label">Visit Summary *</label>
          <textarea
            value={summaryNotes}
            onChange={(e) => setSummaryNotes(e.target.value)}
            required
            className="input-field"
            rows={6}
            placeholder="Describe the visit - what you did, how the pet behaved, any notable events..."
          />
        </div>

        <div>
          <label className="label">Visit Photos</label>
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
              disabled={loading}
            />
            <label
              htmlFor="photo-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                {photoFiles.length > 0
                  ? `${photoFiles.length} photo${photoFiles.length > 1 ? 's' : ''} selected`
                  : 'Add photos'}
              </span>
            </label>
          </div>

          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Visit...
            </>
          ) : (
            'Create Visit Record'
          )}
        </button>
      </form>
    </div>
  );
}

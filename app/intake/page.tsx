'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';

const behaviorOptions = [
  'pulls',
  'reactive',
  'scared',
  'food motivated',
  'runner',
  'barker',
];

export default function IntakePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    petName: '',
    petType: '',
    breed: '',
    age: '',
    behaviorFlags: [] as string[],
    entryBehavior: '',
    allergies: '',
    medications: '',
    vetInfo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBehaviorToggle = (behavior: string) => {
    if (formData.behaviorFlags.includes(behavior)) {
      setFormData({
        ...formData,
        behaviorFlags: formData.behaviorFlags.filter((b) => b !== behavior),
      });
    } else {
      setFormData({
        ...formData,
        behaviorFlags: [...formData.behaviorFlags, behavior],
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create client
      const clientRef = await addDoc(collection(db, 'clients'), {
        name: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        createdAt: serverTimestamp(),
      });

      // Upload pet photo if provided
      let photoUrl = '';
      if (photoFile) {
        const photoRef = ref(storage, `pets/${clientRef.id}/${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        photoUrl = await getDownloadURL(photoRef);
      }

      // Create pet
      await addDoc(collection(db, 'pets'), {
        clientId: clientRef.id,
        name: formData.petName,
        type: formData.petType,
        breed: formData.breed,
        age: formData.age,
        behaviorFlags: formData.behaviorFlags,
        entryBehavior: formData.entryBehavior,
        allergies: formData.allergies,
        meds: formData.medications,
        vetInfo: formData.vetInfo,
        photoUrl,
      });

      router.push('/intake/success');
    } catch (err) {
      console.error('Error submitting intake form:', err);
      setError('Failed to submit form. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-primary-600 hover:text-primary-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">New Client Intake</h1>
          </div>
          <Link
            href="/admin/login"
            className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400"
          >
            Admin Login
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Owner Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Owner Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  name="ownerName"
                  required
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Home Address *</label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Pet Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pet Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Pet Name *</label>
                <input
                  type="text"
                  name="petName"
                  required
                  value={formData.petName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Pet Type *</label>
                <input
                  type="text"
                  name="petType"
                  required
                  value={formData.petType}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Dog, Cat, etc."
                />
              </div>

              <div>
                <label className="label">Breed *</label>
                <input
                  type="text"
                  name="breed"
                  required
                  value={formData.breed}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Age *</label>
                <input
                  type="text"
                  name="age"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 3 years"
                />
              </div>

              <div>
                <label className="label">Behavior Checklist</label>
                <div className="grid grid-cols-2 gap-3">
                  {behaviorOptions.map((behavior) => (
                    <button
                      key={behavior}
                      type="button"
                      onClick={() => handleBehaviorToggle(behavior)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                        formData.behaviorFlags.includes(behavior)
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      {behavior}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">
                  What happens when someone enters your home? *
                </label>
                <textarea
                  name="entryBehavior"
                  required
                  value={formData.entryBehavior}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                  placeholder="Describe your pet&apos;s typical reaction..."
                />
              </div>

              <div>
                <label className="label">Allergies</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="input-field"
                  rows={2}
                  placeholder="Any known allergies..."
                />
              </div>

              <div>
                <label className="label">Medications</label>
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  className="input-field"
                  rows={2}
                  placeholder="Current medications and dosage..."
                />
              </div>

              <div>
                <label className="label">Veterinarian Information *</label>
                <textarea
                  name="vetInfo"
                  required
                  value={formData.vetInfo}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                  placeholder="Vet name, clinic, phone number..."
                />
              </div>

              <div>
                <label className="label">Pet Photo</label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {photoFile ? photoFile.name : 'Choose a photo'}
                    </span>
                  </label>
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Pet preview"
                      className="mt-4 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
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
              'Submit Intake Form'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

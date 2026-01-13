'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Loader2, Phone, Mail, MapPin, User } from 'lucide-react';
import type { Client, Pet } from '@/types';

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  
  const [client, setClient] = useState<Client | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch client
        const clientDoc = await getDoc(doc(db, 'clients', clientId));
        if (clientDoc.exists()) {
          setClient({ id: clientDoc.id, ...clientDoc.data() } as Client);
        }

        // Fetch pets
        const petsRef = collection(db, 'pets');
        const q = query(petsRef, where('clientId', '==', clientId));
        const petsSnapshot = await getDocs(q);
        
        const petsData = petsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pet[];

        setPets(petsData);
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Client not found</p>
        <Link href="/admin/clients" className="btn-primary mt-4 inline-block">
          Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/clients" className="text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Client Details</h2>
      </div>

      {/* Client Info */}
      <div className="card">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-primary-100 p-3 rounded-full">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{client.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Client since {client.createdAt?.toDate().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="w-5 h-5 text-gray-400" />
            <a href={`tel:${client.phone}`} className="hover:text-primary-600">
              {client.phone}
            </a>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5 text-gray-400" />
            <a href={`mailto:${client.email}`} className="hover:text-primary-600">
              {client.email}
            </a>
          </div>
          <div className="flex items-start gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <span>{client.address}</span>
          </div>
        </div>
      </div>

      {/* Pets */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Pets ({pets.length})
        </h3>
        
        {pets.length > 0 ? (
          <div className="space-y-4">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-4">
                  {pet.photoUrl && (
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{pet.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {pet.type} • {pet.breed} • {pet.age}
                    </p>
                    
                    {pet.behaviorFlags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pet.behaviorFlags.map((flag) => (
                          <span
                            key={flag}
                            className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <div>
                        <strong>Entry Behavior:</strong> {pet.entryBehavior}
                      </div>
                      {pet.allergies && (
                        <div>
                          <strong>Allergies:</strong> {pet.allergies}
                        </div>
                      )}
                      {pet.meds && (
                        <div>
                          <strong>Medications:</strong> {pet.meds}
                        </div>
                      )}
                      {pet.vetInfo && (
                        <div>
                          <strong>Vet:</strong> {pet.vetInfo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-6">No pets registered</p>
        )}
      </div>
    </div>
  );
}

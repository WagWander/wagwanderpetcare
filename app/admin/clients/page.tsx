'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, User, Search } from 'lucide-react';
import type { Client } from '@/types';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsRef = collection(db, 'clients');
        const q = query(clientsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const clientsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Client[];

        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
        <span className="text-sm text-gray-600">{clients.length} total</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Clients List */}
      {filteredClients.length > 0 ? (
        <div className="card divide-y">
          {filteredClients.map((client) => (
            <Link
              key={client.id}
              href={`/admin/clients/${client.id}`}
              className="block py-4 hover:bg-gray-50 transition-colors first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary-100 p-2 rounded-full">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{client.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{client.phone}</p>
                  <p className="text-sm text-gray-600">{client.email}</p>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {client.address}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            {searchTerm ? 'No clients found' : 'No clients yet'}
          </p>
        </div>
      )}
    </div>
  );
}

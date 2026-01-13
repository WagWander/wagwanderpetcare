'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import type { Settings } from '@/types';

export default function PayPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'config'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as Settings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const paymentLinks = settings?.paymentLinks || {
    walk30: 'https://buy.stripe.com/5kQeVfb36cOC1Qz2UV6kg05',
    walk60: 'https://buy.stripe.com/6oU6oJ4EIg0Ocvd9jj6kg04',
    homeVisit: 'https://buy.stripe.com/00wdRb3AE4i6eDldzz6kg03',
  };

  const handlePaymentClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Make a Payment</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              Select the service you&apos;d like to pay for. You&apos;ll be redirected to our secure payment portal.
            </p>

            <button
              onClick={() => handlePaymentClick(paymentLinks.walk30)}
              className="card w-full hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Dog Walk - 30 Minutes
                  </h3>
                  <p className="text-2xl font-bold text-primary-600 mt-1">$25</p>
                </div>
                <ExternalLink className="w-6 h-6 text-gray-400" />
              </div>
            </button>

            <button
              onClick={() => handlePaymentClick(paymentLinks.walk60)}
              className="card w-full hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Dog Walk - 60 Minutes
                  </h3>
                  <p className="text-2xl font-bold text-primary-600 mt-1">$40</p>
                </div>
                <ExternalLink className="w-6 h-6 text-gray-400" />
              </div>
            </button>

            <button
              onClick={() => handlePaymentClick(paymentLinks.homeVisit)}
              className="card w-full hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Home Visit - Any Animal
                  </h3>
                  <p className="text-2xl font-bold text-primary-600 mt-1">$75</p>
                </div>
                <ExternalLink className="w-6 h-6 text-gray-400" />
              </div>
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-800">
                All payments are processed securely through Stripe. You&apos;ll receive a confirmation email after payment.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

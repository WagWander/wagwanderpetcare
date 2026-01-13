import Link from 'next/link';
import { Phone, Instagram, CreditCard, Calendar, UserPlus } from 'lucide-react';

export default function HomePage() {
  const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+18458240221';
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/wagwanderpetcare';

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary-700 text-center">
            Wag & Wander Pet Care
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Professional pet care with love
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/booking"
            className="flex items-center justify-center gap-3 w-full bg-primary-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg"
          >
            <Calendar className="w-6 h-6" />
            Book a Service
          </Link>

          <Link
            href="/intake"
            className="flex items-center justify-center gap-3 w-full bg-white text-primary-600 border-2 border-primary-600 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors"
          >
            <UserPlus className="w-6 h-6" />
            New Client Intake
          </Link>

          <a
            href={`sms:${businessPhone}`}
            className="flex items-center justify-center gap-3 w-full bg-green-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <Phone className="w-6 h-6" />
            Text Me
          </a>

          <Link
            href="/pay"
            className="flex items-center justify-center gap-3 w-full bg-purple-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors shadow-lg"
          >
            <CreditCard className="w-6 h-6" />
            Pay Now
          </Link>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-colors shadow-lg"
          >
            <Instagram className="w-6 h-6" />
            Follow on Instagram
          </a>
        </div>

        {/* Services & Pricing */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Services & Pricing
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-semibold text-gray-800">Dog Walk</p>
                <p className="text-sm text-gray-600">30 minutes</p>
              </div>
              <p className="text-xl font-bold text-primary-600">$25</p>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-semibold text-gray-800">Dog Walk</p>
                <p className="text-sm text-gray-600">60 minutes</p>
              </div>
              <p className="text-xl font-bold text-primary-600">$40</p>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-semibold text-gray-800">Home Visit</p>
                <p className="text-sm text-gray-600">Any animal</p>
              </div>
              <p className="text-xl font-bold text-primary-600">$75</p>
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-semibold text-gray-800">Home Visit</p>
                <p className="text-sm text-gray-600">With medical care</p>
              </div>
              <p className="text-xl font-bold text-primary-600">$80</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
          <p className="text-gray-600">{businessPhone}</p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            @wagwanderpetcare
          </a>
        </div>
      </div>
    </main>
  );
}

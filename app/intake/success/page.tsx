import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function IntakeSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Wag & Wander!
          </h1>
          <p className="text-gray-600 mb-6">
            Your intake form has been submitted successfully. We'll review your information and reach out to you shortly.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}

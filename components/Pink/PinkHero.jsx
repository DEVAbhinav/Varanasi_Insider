// components/Pink/PinkHero.jsx
import Link from 'next/link';
import { ShieldCheckIcon, PhoneIcon } from '@heroicons/react/solid';
import Image from 'next/image';

export default function PinkHero() {
  return (
    <div className="relative bg-pink-50 text-center py-20 px-4 overflow-hidden">
      <div className="absolute inset-0">
        {/* Replace with an actual image of a woman driver at a ghat */}
        <Image
          src="/images/lady-taxi.jpeg"
          alt="Female taxi driver in Varanasi"
          fill
          style={{ objectFit: 'cover', opacity: 0.2 }}
        />
      </div>
      <div className="relative z-10">
        <h1 className="text-5xl font-bold text-pink-600">Women-Only Cabs in Varanasi</h1>
        <p className="text-2xl mt-4 font-semibold text-gray-800">Driven by Trained Lady Chauffeurs.</p>
        <Link href="#booking" className="mt-8 inline-block bg-pink-500 text-white font-bold py-4 px-10 rounded-full hover:bg-pink-600 transition-colors text-lg">
          Book Now
        </Link>
        <div className="mt-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-center bg-white/60 p-3 rounded-lg shadow">
            <ShieldCheckIcon className="h-6 w-6 text-green-500 mr-2" />
            <span className="font-semibold text-gray-700">GPS-Tracked</span>
          </div>
          <div className="flex items-center justify-center bg-white/60 p-3 rounded-lg shadow">
            <PhoneIcon className="h-6 w-6 text-blue-500 mr-2" />
            <span className="font-semibold text-gray-700">24x7 Helpline</span>
          </div>
          <div className="flex items-center justify-center bg-white/60 p-3 rounded-lg shadow">
            <ShieldCheckIcon className="h-6 w-6 text-red-500 mr-2" />
            <span className="font-semibold text-gray-700">Police-Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

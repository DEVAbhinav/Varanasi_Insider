// components/Pink/KeyBenefits.jsx
import { ShieldCheckIcon, LocationMarkerIcon, SparklesIcon } from '@heroicons/react/solid';

export default function KeyBenefits() {
  return (
    <div className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 shadow-lg rounded-lg bg-pink-50">
            <ShieldCheckIcon className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2 text-pink-600">Safety First</h3>
            <p className="text-gray-700">In-cab SOS, CCTV surveillance, and a dedicated 24/7 helpline ensure your peace of mind on every ride.</p>
          </div>
          <div className="p-6 shadow-lg rounded-lg bg-pink-50">
            <LocationMarkerIcon className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2 text-pink-600">Local Expertise</h3>
            <p className="text-gray-700">Our drivers are not just chauffeurs but your local guides to discover the hidden gems of Varanasi.</p>
          </div>
          <div className="p-6 shadow-lg rounded-lg bg-pink-50">
            <SparklesIcon className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2 text-pink-600">Empowering Women</h3>
            <p className="text-gray-700">In partnership with Mission Shakti, every ride you take contributes to women's empowerment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

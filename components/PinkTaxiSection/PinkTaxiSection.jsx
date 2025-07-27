// components/PinkTaxiSection/PinkTaxiSection.jsx
import Link from 'next/link';

export default function PinkTaxiSection() {
  return (
    <section className="bg-pink-50 py-3 px-4 text-center">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <p className="text-md text-gray-700">
          For women, by women: Our <strong className="text-pink-600">Pink Taxi Service</strong> offers safe and reliable rides. 
          <Link href="/pink-taxi-varanasi" className="ml-2 font-bold text-pink-600 hover:underline">
            Learn More &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}

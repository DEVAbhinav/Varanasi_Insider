// components/PinkTaxiSection/PinkTaxiSection.jsx
import Link from 'next/link';

export default function PinkTaxiSection() {
  return (
    <section className="bg-pink-50 py-16 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-pink-600">Introducing Our Pink Taxi Service</h2>
        <p className="mt-4 text-lg text-gray-700">Safe and reliable rides for women, by women.</p>
        <Link href="/pink-taxi-varanasi" className="mt-8 inline-block bg-pink-500 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-600 transition-colors">
            Learn More about Pink Taxi
        </Link>
      </div>
    </section>
  );
}

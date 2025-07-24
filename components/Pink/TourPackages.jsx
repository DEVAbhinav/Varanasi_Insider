// components/Pink/TourPackages.jsx
import Link from 'next/link';

export default function TourPackages() {
  const packages = [
    { name: "Sunrise Ghat Tour", duration: "3 Hours", highlights: "Boat ride, morning aarti", price: "₹1500" },
    { name: "Temple Triangle", duration: "4 Hours", highlights: "Kashi Vishwanath, Sankat Mochan", price: "₹1800" },
    { name: "Sarnath Discovery", duration: "5 Hours", highlights: "Dhamek Stupa, Museum", price: "₹2200" },
    { name: "Weaver's Village Trail", duration: "4 Hours", highlights: "Live silk weaving demo", price: "₹2000" },
  ];

  return (
    <div className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Popular Tour Packages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map(pkg => (
            <div key={pkg.name} className="border rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-xl mb-2 text-pink-600">{pkg.name}</h3>
              <p className="font-semibold text-gray-600">{pkg.duration}</p>
              <p className="text-sm text-gray-500 my-2">{pkg.highlights}</p>
              <p className="text-lg font-bold text-gray-800">From {pkg.price}</p>
              <Link href="/packages" className="mt-4 inline-block text-pink-500 font-bold hover:underline">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// components/Pink/FareEstimator.jsx
export default function FareEstimator() {
  return (
    <div id="booking" className="py-20 px-4 bg-pink-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Quick Fare & Tour Selector</h2>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select className="p-3 border rounded-lg w-full" defaultValue="">
              <option value="" disabled>Select Pick-up</option>
              <option>Airport (VNS)</option>
              <option>Cantt Railway Station</option>
              <option>Assi Ghat</option>
            </select>
            <select className="p-3 border rounded-lg w-full" defaultValue="">
              <option value="" disabled>Select Drop-off</option>
              <option>Assi Ghat</option>
              <option>Dashashwamedh Ghat</option>
              <option>Sarnath</option>
            </select>
            <input type="date" className="p-3 border rounded-lg w-full" />
            <select className="p-3 border rounded-lg w-full" defaultValue="">
              <option value="" disabled>Select Tour Type</option>
              <option>Half-day City Tour</option>
              <option>Full-day City Tour</option>
              <option>Airport Transfer</option>
            </select>
            <button type="submit" className="md:col-span-2 bg-pink-500 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-600 transition-colors">
              <a href="tel:+919450401573">Get Fare Estimate</a>
            </button>
          </form>
          <p className="mt-4 text-gray-600">Or <a href="https://wa.me/919450301573" className="text-green-500 font-bold hover:underline">Chat on WhatsApp</a></p>
        </div>
      </div>
    </div>
  );
}

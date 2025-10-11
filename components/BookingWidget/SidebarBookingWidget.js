import { useState } from 'react';
import styles from './SidebarBookingWidget.module.css';

export default function SidebarBookingWidget() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    passengers: '1',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.phone) {
      setError('Please fill in your name and phone number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          passengers: formData.passengers,
          tripType: 'Quick Inquiry',
          pickupDate: formData.date,
          message: `Quick inquiry from blog sidebar. Date: ${formData.date}, Passengers: ${formData.passengers}`,
          source: 'Blog Sidebar Widget',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.open(data.whatsappLink, '_blank');
        }, 1500);
        
        setFormData({
          name: '',
          phone: '',
          email: '',
          passengers: '1',
          date: '',
        });
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.widget}>
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-bold text-green-600 mb-2">Thank You!</h3>
          <p className="text-sm text-gray-700">
            We'll contact you shortly
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 text-white p-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20px 20px, white 1.5%, transparent 0%), radial-gradient(circle at 60px 60px, white 1.5%, transparent 0%)',
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-1 drop-shadow-md">🚕 Quick Booking</h3>
          <p className="text-sm text-blue-50">Get instant quote</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2.5 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full px-3.5 py-2.5 text-sm border-2 border-blue-100 rounded-xl focus:ring-3 focus:ring-cyan-200 focus:border-cyan-400 transition-all bg-white hover:border-cyan-200"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2.5 text-sm border-2 border-blue-100 rounded-xl focus:ring-3 focus:ring-cyan-200 focus:border-cyan-400 transition-all bg-white hover:border-cyan-200"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Travel Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border-2 border-blue-100 rounded-xl focus:ring-3 focus:ring-cyan-200 focus:border-cyan-400 transition-all bg-white hover:border-cyan-200"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Passengers
          </label>
          <select
            name="passengers"
            value={formData.passengers}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border-2 border-blue-100 rounded-xl focus:ring-3 focus:ring-cyan-200 focus:border-cyan-400 transition-all bg-white hover:border-cyan-200"
          >
            <option value="1">1 person</option>
            <option value="2">2 people</option>
            <option value="3">3 people</option>
            <option value="4">4 people</option>
            <option value="5-6">5-6 people</option>
            <option value="7+">7+ (Tempo)</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? 'Sending...' : '🚕 Get Quote Now'}
        </button>

        <p className="text-xs text-gray-600 text-center mt-3 font-medium">
          Or call: <a href="tel:9450301573" className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors">94503 01573</a>
        </p>
      </form>
    </div>
  );
}

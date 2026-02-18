import Link from 'next/link';

export default function PinkSeoCopy() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-6 text-gray-700">
        <h2 className="text-3xl font-bold text-pink-600 md:text-4xl">Pink Taxi Varanasi: Safe Cabs for Women, Families and Late-Night Arrivals</h2>
        <p className="text-base leading-relaxed md:text-lg">
          Our Pink Taxi fleet pairs <strong>police-verified lady chauffeurs</strong> with GPS-tracked sedans so solo women, students, corporate guests and families
          can travel anywhere in Kashi with confidence. Whether you land at Lal Bahadur Shastri Airport after midnight, need a <strong>Subah-e-Banaras 4:30&nbsp;AM pickup</strong>,
          or want a chauffeur to accompany you between temples, we stay on the call throughout the ride and share driver details before dispatch.
        </p>
        <p className="text-base leading-relaxed md:text-lg">
          Pink Taxi covers Assi, Dashashwamedh, Godowlia, BHU, Sarnath, Cantt station, major hotels, women&apos;s hostels and outstation routes like <Link className="text-pink-600 underline" href="/en/varanasi-to-ayodhya">Varanasi to Ayodhya</Link>,
          <Link className="text-pink-600 underline" href="/en/varanasi-to-prayagraj">Prayagraj</Link> and <Link className="text-pink-600 underline" href="/en/varanasi-to-gaya-bodh-gaya-tour-package">Bodh Gaya</Link>. Drivers carry emergency contact cards, spare dupattas and quick-dial shortcuts to Women Power-Line 1091 and UP 112.
        </p>
        <p className="text-base leading-relaxed md:text-lg">
          To reserve your trusted cab, WhatsApp <a className="text-pink-600 underline" href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer">+91-99354-74730</a>
          or call <a className="text-pink-600 underline" href="tel:+918062182380">+91-80621-82380</a>. Share arrival details, headcount and luggage, and we will lock the fare (parking, night allowance, tolls) before you travel. For city itineraries, combine
          a Pink Taxi with our <Link className="text-pink-600 underline" href="/en/varanasi-day-tour-cab-charges">Varanasi day tour cab package</Link> or tailor a multi-day temple circuit with women-guides on request.
        </p>
        <div className="rounded-lg bg-pink-50 p-6 text-sm leading-7 text-gray-700">
          <p className="font-semibold text-pink-700">Pink Taxi Promises</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Real-time tracking shared with your emergency contact.</li>
            <li>Lady chauffeur or safety marshal for night transfers.</li>
            <li>Flexible payment: UPI, card link or cash at drop.</li>
            <li>Support team stays online until you confirm safe arrival.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

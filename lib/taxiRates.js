import { formatINR } from './pricing';

export const TAXI_RATE_CARDS = [
  {
    id: 'airport',
    title: 'Airport → City',
    subtitle: '25-30 km • 40-50 min',
    highlight: true,
    rates: [
      { vehicle: 'Sedan', amount: 899, note: 'Dzire/Etios' },
      { vehicle: 'Ertiga', amount: 1299, note: '7-seater' },
      { vehicle: 'Innova', amount: 1500, note: '6-seater' },
      { vehicle: 'Tempo', amount: 2500, note: '17-seater' },
    ],
  },
  {
    id: 'half-day',
    title: 'Half-Day Tour',
    subtitle: '4 hours • 40 km',
    rates: [
      { vehicle: 'Sedan', amount: 1100, note: '' },
      { vehicle: 'Innova', amount: 1600, note: '' },
      { vehicle: 'Tempo', amount: 2200, note: '' },
    ],
  },
  {
    id: 'full-day',
    title: 'Full-Day Tour',
    subtitle: '8 hours • 80 km',
    popular: true,
    rates: [
      { vehicle: 'Sedan', amount: 2499, note: '' },
      { vehicle: 'Innova', amount: 3200, note: '' },
      { vehicle: 'Tempo', amount: 4250, note: '' },
    ],
  },
  {
    id: 'extended',
    title: 'Extended Package',
    subtitle: '12 hours • 120 km',
    rates: [
      { vehicle: 'Sedan', amount: 3200, note: '' },
      { vehicle: 'Innova', amount: 4500, note: '' },
      { vehicle: 'Tempo', amount: 5500, note: '' },
    ],
  },
];

export const AIRPORT_CITY_SEDAN_FARE = TAXI_RATE_CARDS[0].rates[0].amount;

export function taxiCostFaqAnswer() {
  return `Indicative Varanasi taxi rates include airport-to-city sedan from ${formatINR(AIRPORT_CITY_SEDAN_FARE)}, half-day sedan from ${formatINR(TAXI_RATE_CARDS[1].rates[0].amount)}, and full-day sedan from ${formatINR(TAXI_RATE_CARDS[2].rates[0].amount)}. The final quote confirms the route, vehicle, pickup time, included kilometres, toll or parking assumptions, and any access restrictions before booking.`;
}

export function airportTaxiFaqAnswer() {
  return `Yes. Pre-booked Varanasi airport pickup starts from ${formatINR(AIRPORT_CITY_SEDAN_FARE)} for the published airport-to-city sedan example. Share the flight number, destination, passenger count, luggage and pickup time so the vehicle, meeting point, inclusions and final fare can be confirmed before booking.`;
}

// components/commerce/icons.jsx
// Badge/fact icon map built on lucide-react (already a dependency). Keeps all
// commerce iconography inline — no external image requests. Badge labels are
// matched case-insensitively against a set of known keys; unknown badges fall
// back to a check icon.

import {
  Snowflake,
  Handshake,
  BadgeIndianRupee,
  ShieldCheck,
  CalendarX,
  Wallet,
  Venus,
  Languages,
  Clock,
  Users,
  Route,
  MapPin,
  Luggage,
  CheckCircle2,
  Ship,
  Landmark,
  Car,
  BedDouble,
} from 'lucide-react';

const BADGE_ICONS = [
  { test: /(^|\b)ac\b|air.?con/i, Icon: Snowflake },
  { test: /meet|greet/i, Icon: Handshake },
  { test: /fixed|transparent|no hidden/i, Icon: BadgeIndianRupee },
  { test: /verified|vetted|permit|safe/i, Icon: ShieldCheck },
  { test: /free.?cancel|cancel/i, Icon: CalendarX },
  { test: /no advance|pay after|advance/i, Icon: Wallet },
  { test: /women|pink|lady/i, Icon: Venus },
  { test: /english|hindi|language|speaking/i, Icon: Languages },
  { test: /24|7|helpline/i, Icon: Clock },
];

export function badgeIcon(label = '') {
  const match = BADGE_ICONS.find((b) => b.test.test(label));
  return match ? match.Icon : CheckCircle2;
}

export const FactIcons = {
  duration: Clock,
  passengers: Users,
  seats: Users,
  distance: Route,
  pickup: MapPin,
  luggage: Luggage,
};

export const ProductTypeIcon = {
  boat: Ship,
  darshan: Landmark,
  vehicle: Car,
  route_taxi: Car,
  accommodation: BedDouble,
  tour_package: MapPin,
  sightseeing: MapPin,
};

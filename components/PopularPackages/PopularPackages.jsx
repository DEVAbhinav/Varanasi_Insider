import Link from 'next/link';
import styles from './PopularPackages.module.css';

const packages = [
	{
		slug: 'varanasi-local-darshan',
		title: 'Varanasi Local Darshan',
		image: 'https://placehold.co/600x400/FBBF24/333?text=Kashi+Temple',
		price: '₹1500',
	},
	{
		slug: 'airport-pickup-drop',
		title: 'Airport Pickup & Drop',
		image: 'https://placehold.co/600x400/F87171/333?text=Airport+Taxi',
		price: '₹950',
	},
	{
		slug: 'prayagraj-day-tour',
		title: 'Prayagraj Day Tour',
		image: 'https://placehold.co/600x400/60A5FA/333?text=Sangam',
		price: '₹3500',
	},
];

export default function PopularPackages() {
	return (
		<section className={styles.container}>
			<h2 className={styles.sectionTitle}>Popular Tour Packages</h2>
			<div className={styles.gridContainer}>
				{packages.map((pkg) => (
					<Link
						key={pkg.slug}
						href={`/en/package/${pkg.slug}`}
						className={styles.card}
					>
						<img
							src={pkg.image}
							alt={pkg.title}
							className={styles.cardImage}
						/>
						<div className={styles.cardContent}>
							<h3 className={styles.cardTitle}>{pkg.title}</h3>
							<p className={styles.cardPrice}>
								Starts from {pkg.price}
							</p>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}

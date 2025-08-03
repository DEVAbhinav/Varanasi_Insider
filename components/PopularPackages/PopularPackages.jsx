import Link from 'next/link';
import Image from 'next/image';
import styles from './PopularPackages.module.css';

const packages = [
	{
		slug: 'varanasi-local-darshan',
		title: 'Varanasi Local Darshan',
		image: '/images/kashi-temple-400x600.jpeg',
		price: '₹1500',
		width: 400,
		height: 600,
	},
	{
		slug: 'airport-pickup-drop',
		title: 'Airport Pickup & Drop',
		image: '/images/airport-taxi-600x400.jpeg',
		price: '₹950',
		width: 600,
		height: 400,
	},
	{
		slug: 'prayagraj-day-tour',
		title: 'Prayagraj Day Tour',
		image: '/images/sangam-600x400.jpeg',
		price: '₹3500',
		width: 600,
		height: 400,
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
						<Image
							src={pkg.image}
							alt={pkg.title}
							className={styles.cardImage}
							width={pkg.width}
							height={pkg.height}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

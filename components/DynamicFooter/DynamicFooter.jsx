import Link from 'next/link';
import Image from 'next/image';
import styles from './DynamicFooter.module.css';

// Mock data for demonstration. In a real app, this would be a prop.
const mockRelatedPosts = [
	{
		lang: 'en',
		slug: 'evening-ganga-aarti',
		title: 'A Guide to the Evening Ganga Aarti',
		image: 'https://placehold.co/400x300/F87171/333?text=Ganga+Aarti',
		description: 'Everything you need to know to experience the magical ceremony.',
	},
	{
		lang: 'en',
		slug: 'boat-ride-on-ganges',
		title: 'Sunrise Boat Rides on the Ganges',
		image: 'https://placehold.co/400x300/60A5FA/333?text=Boat+Ride',
		description: 'Why a morning boat ride is an unforgettable experience.',
	},
];

export default function DynamicFooter({ relatedPosts = mockRelatedPosts }) {
	if (!relatedPosts || relatedPosts.length === 0) {
		return null;
	}

	return (
		<div className={styles.container}>
			<div className={styles.innerContainer}>
				<h2 className={styles.sectionTitle}>
					Read Next
				</h2>
				<div className={styles.gridContainer}>
					{relatedPosts.map((post) => (
						<Link
							key={post.slug}
							href={`/${post.lang}/${post.slug}`}
							className={styles.card}
						>
							<div className={styles.imageContainer}>
								<Image
									src={post.image}
									alt={post.title}
									className={styles.cardImage}
									width={400}
									height={300}
								/>
								<div className={styles.overlay}>
									<h3 className={styles.cardTitle}>
										{post.title}
									</h3>
								</div>
							</div>
							<div className={styles.cardContent}>
								<p className={styles.cardDescription}>
									{post.description}
								</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

import styles from './WhyUs.module.css';
// Assuming you use a library like react-icons
// import { FaCar, FaShieldAlt, FaClock } from 'react-icons/fa';

const features = [
	{
		// icon: <FaCar />,
		icon: '🚗',
		title: 'Quality Fleet',
		description: 'Clean, well-maintained vehicles for a comfortable journey.',
	},
	{
		// icon: <FaShieldAlt />,
		icon: '🛡️',
		title: 'Safety First',
		description: 'Experienced, professional drivers who prioritize your safety.',
	},
	{
		// icon: <FaClock />,
		icon: '🕒',
		title: 'Always On Time',
		description: 'Punctual service for airport transfers and scheduled tours.',
	},
];

export default function WhyUs() {
	return (
		<section className={styles.container} aria-label="Why choose Vinayak Travels">
			<header>
				<h2 className={styles.sectionTitle}>Why Choose Vinayak Travels Tour?</h2>
			</header>
			<div className={styles.gridContainer}>
				{features.map((feature, index) => (
					<article key={index} className={styles.featureCard}>
						<div className={styles.iconWrapper} role="img" aria-label={`${feature.title} icon`}>{feature.icon}</div>
						<h3 className={styles.featureTitle}>{feature.title}</h3>
						<p className={styles.featureDescription}>{feature.description}</p>
					</article>
				))}
			</div>
		</section>
	);
}

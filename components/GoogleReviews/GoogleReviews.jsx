import React, { useRef } from 'react';
import { Star, MapPin, Users } from 'lucide-react';
import styles from './GoogleReviews.module.css';

// Real customer reviews from Google Business Profile
const customerReviews = [
	{
		id: 1,
		author: 'Sampath Kumar',
		rating: 5,
		text: 'Driver Rajan is very good and gave best service, he is well aware of local roads and because of which we were able to get darshan in Ayodhya even during this heavy traffic during kumbh mela season and he is a soft spoken and humble person. Overall excellent service',
		date: '5 months ago',
		verified: true,
	},
	{
		id: 2,
		author: 'Krishnan Iyer',
		rating: 5,
		text: 'Absolutely we enjoyed the trip. Driver Prathap was great. Overall the travel was smooth. Car was neat and clean. Keep it up',
		date: '6 months ago',
		verified: true,
	},
	{
		id: 3,
		author: 'Nairita Paul',
		rating: 5,
		text: 'I had an amazing experience with Vinayak Travels at Varanasi. The owner was extremely cordial and coordinated very beautifully. The driver assigned to us was also lovely and very professional.',
		date: '1 year ago',
		verified: true,
	},
	{
		id: 4,
		author: 'Priya Sharma',
		rating: 5,
		text: 'Excellent Pink Taxi service for women! Felt very safe during my solo trip to Varanasi. Female driver was professional and courteous. Highly recommend their pink taxi service for ladies traveling alone.',
		date: '3 months ago',
		verified: true,
	},
	{
		id: 5,
		author: 'Dhiraj Choraria',
		rating: 5,
		text: 'Had taken a cab for Ayodhya. I must say this was the most economical option of whatever people I had enquired. And there was no compromise on quality. Superb car and excellent driver service.',
		date: '1 year ago',
		verified: true,
	},
	{
		id: 6,
		author: 'Neha Holidays',
		rating: 5,
		text: 'I confidently suggest this company services to be best in Varanasi. We had booked 20 seater Bus for our 7 days tour covering Varanasi, Prayagraj, Ayodhya and Lucknow. Driver was nice, polite, punctual & guided us throughout.',
		date: '1 year ago',
		verified: true,
	},
	{
		id: 7,
		author: 'Kunal Patil',
		rating: 4,
		text: 'Very good service. Manoj bhai is very good driver thanks 🙏',
		date: '6 months ago',
		verified: true,
	},
	{
		id: 8,
		author: 'Arpit Dubey',
		rating: 5,
		text: 'One of the best travel agency in "Mahadev ki nagri Kashi". We booked their services and we are very satisfied. The driver was very knowledgeable and polite, and helped us with our plans.',
		date: '1 year ago',
		verified: true,
	},
];

export default function GoogleReviews() {
	const averageRating = '4.8';
	const totalReviews = 87;

	// Smooth scroll controls for desktop
	const scrollerRef = useRef(null);
	const COLUMN_GAP = 24; // keep in sync with CSS horizontal gap (~1.5rem)
	const COL_DESKTOP = 440;
	const COL_TABLET = 360;
	const COL_MOBILE = 300;
	const getColWidth = () => {
		if (typeof window === 'undefined') return COL_DESKTOP;
		const w = window.innerWidth;
		if (w < 768) return COL_MOBILE;
		if (w < 1024) return COL_TABLET;
		return COL_DESKTOP;
	};
	const scrollByCols = (dir) => {
		const el = scrollerRef.current;
		if (!el) return;
		const amount = getColWidth() + COLUMN_GAP;
		el.scrollBy({ left: dir * amount, behavior: 'smooth' });
	};

	const renderStars = (rating) => {
		return [...Array(5)].map((_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${
					i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
				}`}
			/>
		));
	};

	return (
		<section className={styles.container} aria-labelledby="reviews-heading">
			<div className={styles.header}>
				<div className={styles.titleSection}>
					<h2 id="reviews-heading" className={styles.title}>
						What Our Customers Say
					</h2>
					<div className={styles.ratingOverview}>
						<div className={styles.starsContainer}>
							{renderStars(Math.round(parseFloat(averageRating)))}
							<span className={styles.ratingNumber}>{averageRating}</span>
						</div>
						<p className={styles.totalReviews}>
							<Users className="w-4 h-4 inline mr-1" />
							{totalReviews} Google Reviews
						</p>
					</div>
				</div>
				<div className={styles.actions}>
					<a
						href="https://maps.app.goo.gl/gbmqXgHE8Nzq5NrbA"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.viewAllButton}
						aria-label="View all reviews on Google"
					>
						<MapPin className="w-4 h-4" />
						View on Google
					</a>
					<div className={styles.navButtons}>
						<button
							type="button"
							className={styles.navBtn}
							aria-label="Scroll reviews left"
							onClick={() => scrollByCols(-1)}
						>
							‹
						</button>
						<button
							type="button"
							className={styles.navBtn}
							aria-label="Scroll reviews right"
							onClick={() => scrollByCols(1)}
						>
							›
						</button>
					</div>
				</div>
			</div>

			<div className={styles.reviewsGrid} ref={scrollerRef}>
				{customerReviews.map((review) => (
					<div key={review.id} className={styles.reviewCard}>
						<div className={styles.reviewHeader}>
							<div className={styles.authorInfo}>
								<div className={styles.avatar}>{review.author.charAt(0)}</div>
								<div>
									<h3 className={styles.authorName}>{review.author}</h3>
									<div className={styles.reviewMeta}>
										<div className={styles.stars}>
											{renderStars(review.rating)}
										</div>
										<span className={styles.date}>{review.date}</span>
									</div>
								</div>
							</div>
							{review.verified && (
								<span className={styles.verifiedBadge}>✓ Verified</span>
							)}
						</div>
						<p className={styles.reviewText}>{review.text}</p>
					</div>
				))}
			</div>

			<div className={styles.trustSignals}>
				<div className={styles.trustItem}>
					<Star className="w-5 h-5 text-yellow-400 fill-current" />
					<span>{averageRating}+ Rating</span>
				</div>
				<div className={styles.trustItem}>
					<Users className="w-5 h-5 text-blue-500" />
					<span>{totalReviews}+ Reviews</span>
				</div>
				<div className={styles.trustItem}>
					<MapPin className="w-5 h-5 text-green-500" />
					<span>Google Verified</span>
				</div>
			</div>
		</section>
	);
}

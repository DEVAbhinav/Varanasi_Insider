// components/ServicePage/ServiceContent.jsx
import styles from './ServiceContent.module.css';
import SidebarBookingWidget from '../BookingWidget/SidebarBookingWidget';

export default function ServiceContent({ contentHtml }) {
  return (
    <section className="py-12 px-4 md:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            <article 
              className={styles.serviceArticle}
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>

          {/* Sidebar with Booking Widget - 1/3 width */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <SidebarBookingWidget />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

import { Recommendation } from '../types/recommendation';
import RecommendationCard from './RecommendationCard';
import Carousel from './Carousel';
import recommendationsData from '../data/recommendations.json';
import styles from './RecommendationsSection.module.css';

const recommendations = recommendationsData as Recommendation[];

function RecommendationsSection() {
  return (
    <section id="recommendations" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Recommendations</h2>
        <Carousel>
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.name} recommendation={rec} />
          ))}
        </Carousel>
        <a
          href="https://www.linkedin.com/in/roseadastra/details/recommendations/?detailScreenTabIndex=0"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkedinLink}
        >
          See more on LinkedIn &rsaquo;
        </a>
      </div>
    </section>
  );
}

export default RecommendationsSection;

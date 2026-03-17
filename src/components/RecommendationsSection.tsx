import { Recommendation } from '../types/recommendation';
import RecommendationCard from './RecommendationCard';
import Carousel from './Carousel';
import recommendationsData from '../data/recommendations.json';

const recommendations = recommendationsData as Recommendation[];

function RecommendationsSection() {
  return (
    <div id="recommendations">
      <h5>Working with Rose is like...</h5>
      <Carousel>
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.name} recommendation={rec} />
        ))}
      </Carousel>
      <a
        href="https://www.linkedin.com/in/roseadastra/details/recommendations/?detailScreenTabIndex=0"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: '0.75rem',
          fontSize: '0.8rem',
          color: '#888',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#333')}
        onMouseLeave={e => (e.currentTarget.style.color = '#888')}
      >
        See more on LinkedIn &rsaquo;
      </a>
    </div>
  );
}

export default RecommendationsSection;

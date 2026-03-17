import { useRef, useState, useEffect } from 'react';
import { Recommendation } from '../types/recommendation';
import styles from './RecommendationCard.module.css';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { name, tagline, date, workedWith, review } = recommendation;
  const reviewRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = reviewRef.current;
    if (el) setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, []);

  return (
    <div className={styles.card}>
      <p
        ref={reviewRef}
        className={`${styles.review} ${expanded ? '' : styles.clamped}`}
      >
        {review}
      </p>
      {isOverflowing && !expanded && (
        <button className={styles.moreButton} onClick={() => setExpanded(true)}>
          (More...)
        </button>
      )}
      <div className={styles.footer}>
        <div className={styles.attribution}>
          <span className={styles.name}>{name}</span>
          <span className={styles.tagline}>{tagline}</span>
        </div>
        <div className={styles.meta}>
          <span className={styles.workedWith}>{workedWith}</span>
          <span className={styles.date}>{date}</span>
        </div>
      </div>
    </div>
  );
}

export default RecommendationCard;

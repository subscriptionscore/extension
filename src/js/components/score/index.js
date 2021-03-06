import React from 'react';
import styles from './score.module.scss';

const Score = ({ emailScore, colorblind = false }) => {
  return (
    <div className={styles.scoreContainer}>
      <Content {...emailScore} colorblind={colorblind} />
    </div>
  );
};

const Content = ({
  frequencyPerWeek = 0,
  unsubscribeAvg = 0,
  unsubscribeDifficulty = 0,
  contentQuality = 1,
  colorblind = false
} = {}) => {
  return (
    <div data-colorblind={colorblind}>
      <div className={styles.scoreItem}>
        <UnsubRate unsubscribeAvg={unsubscribeAvg} />
      </div>
      <div className={styles.scoreItem}>
        <Frequency frequencyPerWeek={frequencyPerWeek} />
      </div>
      <div className={styles.scoreItem}>
        <ContentScore contentQuality={contentQuality} />
      </div>
      <div className={styles.scoreItem}>
        <UnsubDifficulty unsubscribeDifficulty={unsubscribeDifficulty} />
      </div>
    </div>
  );
};

const UnsubDifficulty = ({ unsubscribeDifficulty }) => {
  let rank = 'low';
  let text = 'Easy';
  if (unsubscribeDifficulty === 1) {
    text = 'Easy';
    rank = 'low';
  } else if (unsubscribeDifficulty === 2) {
    text = 'Tedious';
    rank = 'medium';
  } else if (unsubscribeDifficulty === 3) {
    rank = 'high';
    text = 'Hard';
  }
  return (
    <>
      <span data-rating={rank} className={styles.value}>
        {text}
      </span>
      <span className={styles.desc}>to unsubscribe</span>
    </>
  );
};

const UnsubRate = ({ unsubscribeAvg }) => {
  let label;
  let rank;
  if (unsubscribeAvg === 1) {
    label = 'Low';
    rank = 'low';
  } else if (unsubscribeAvg === 0) {
    label = 'Avg';
    rank = 'medium';
  } else {
    label = 'High';
    rank = 'high';
  }

  return (
    <>
      <span data-rating={rank} className={styles.value}>
        {label}
      </span>
      <span className={styles.desc}>unsubscribe rate</span>
    </>
  );
};

const Frequency = ({ frequencyPerWeek }) => {
  let frequencyValue;
  let frequencyDesc;
  let frequencyRank;
  if (frequencyPerWeek < 0.25) {
    frequencyValue = '0-1';
    frequencyDesc = 'emails per month';
    frequencyRank = 'low';
  } else if (frequencyPerWeek < 1) {
    frequencyValue = '1';
    frequencyDesc = 'email per week';
    frequencyRank = 'low';
  } else if (frequencyPerWeek < 2) {
    frequencyValue = '1-2';
    frequencyDesc = 'emails per week';
    frequencyRank = 'medium';
  } else if (frequencyPerWeek < 5) {
    frequencyValue = Math.round(frequencyPerWeek);
    frequencyDesc = 'emails per week';
    frequencyRank = 'medium';
  } else {
    frequencyValue = Math.round(frequencyPerWeek);
    frequencyDesc = 'emails per week';
    frequencyRank = 'high';
  }

  return (
    <>
      <span data-rating={frequencyRank} className={styles.value}>
        {frequencyValue}
      </span>
      <span className={styles.desc}>{frequencyDesc}</span>
    </>
  );
};

// const Rank = ({ rank = 'A+', score, showDelta = true, trend = 0 }) => {
//   let trendText = 'neutral';
//   if (trend > 0) {
//     trendText = 'up';
//   } else if (trend < 0) {
//     trendText = 'down';
//   }
//   return (
//     <div className={styles.rank}>
//       <span data-rank={rank} className={styles.rankValue}>
//         {rank}
//       </span>
//       {showDelta ? (
//         <span data-trend={trendText} className={styles.delta}></span>
//       ) : null}
//       <span data-rank={rank} className={styles.score}>
//         {(score * 10).toFixed(2)}
//       </span>
//     </div>
//   );
// };

const ContentScore = ({ contentQuality = 1 }) => {
  let text;
  let rank;
  if (contentQuality === 1) {
    text = 'High';
    rank = 'low';
  } else if (contentQuality === 2) {
    text = 'Medium';
    rank = 'medium';
  } else if (contentQuality === 3) {
    text = 'Low';
    rank = 'high';
  }
  return (
    <>
      <span data-rating={rank} className={styles.value}>
        {text}
      </span>
      <span className={styles.desc}>quality content</span>
    </>
  );
};

export default Score;

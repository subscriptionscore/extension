import React from 'react';

import styles from './score.module.scss';

const Score = ({ emailScore }) => {
  return (
    <div className={styles.scoreContainer}>
      <Content {...emailScore} />
    </div>
  );
};

const Content = ({
  frequencyPerWeek = 0,
  unsubscribeRate = 0,
  unsubscribeDifficulty = 0,
  contentQuality = 1
} = {}) => {
  return (
    <div className={styles.scoreContent}>
      <div className={styles.scoreItem}>
        <UnsubRate unsubscribeRate={unsubscribeRate} />
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

const UnsubRate = ({ unsubscribeRate }) => {
  let percentage = unsubscribeRate * 100;
  if (percentage < 1) {
    percentage = '<1';
  } else {
    percentage = Math.floor(percentage);
  }
  let rank;
  if (percentage < 10) {
    rank = 'low';
  } else if (percentage < 50) {
    rank = 'medium';
  } else {
    rank = 'high';
  }
  return (
    <>
      <span data-rating={rank} className={styles.value}>
        {percentage}%
      </span>
      <span className={styles.desc}>of people unsubscribe</span>
    </>
  );
};

const Frequency = ({ frequencyPerWeek }) => {
  let frequencyValue;
  let frequencyDesc;
  let frequencyRank;
  if (frequencyPerWeek < 0.25) {
    frequencyValue = '<1';
    frequencyDesc = 'email per month';
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
const Rank = ({ rank = 'A+', score, showDelta = true, trend = 0 }) => {
  let trendText = 'neutral';
  if (trend > 0) {
    trendText = 'up';
  } else if (trend < 0) {
    trendText = 'down';
  }
  return (
    <div className={styles.rank}>
      <span data-rank={rank} className={styles.rankValue}>
        {rank}
      </span>
      {showDelta ? (
        <span data-trend={trendText} className={styles.delta}></span>
      ) : null}
      <span data-rank={rank} className={styles.score}>
        {(score * 10).toFixed(2)}
      </span>
    </div>
  );
};

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

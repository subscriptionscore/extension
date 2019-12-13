import React, { useMemo } from 'react';
import Rank from '../components/rank';

import './reset.scss';
import styles from './domain-score.module.scss';
import Score from '../components/score';
import useDomainScore from '../hooks/use-domain-score';

export default function DomainScore({ url }) {
  const { value, loading, error, domain } = useDomainScore(url);

  const content = useMemo(() => {
    if (loading) {
      return <div className={styles.loading}>Loading...</div>;
    } else if (error) {
      return (
        <>
          <div className={styles.avgScore}>
            <h2>
              <Rank compact rank={'unknown'} />
              <span className={styles.title}>{domain}</span>
            </h2>
          </div>
          <div className={styles.content}>
            <div className={styles.empty}>{getErrorMessage(error)}</div>
          </div>
        </>
      );
    }

    const { searchDomain } = value ? value : {};
    if (!searchDomain || !searchDomain.score) {
      return (
        <>
          <div className={styles.avgScore}>
            <h2>
              <Rank compact rank={'unknown'} />
              <span className={styles.title}>{domain}</span>
            </h2>
          </div>
          <div className={styles.content}>
            <div className={styles.empty}>
              We don't have enough data to score this website's subscription
              emails yet.
            </div>
          </div>
        </>
      );
    }
    const {
      rank,
      domain: normalizedDomain,
      scores,
      ...scoreData
    } = searchDomain;
    return (
      <>
        <div className={styles.avgScore}>
          <h2>
            <Rank compact rank={rank} />
            <span className={styles.title}>{normalizedDomain || domain}</span>
          </h2>
        </div>
        <div className={styles.content}>
          <Score emailScore={scoreData} />
          {/* <ul>
            {scores.map(({ rank, score, email }) => (
              <li key={email}>
                <span>{rank}</span>
                <span>{email}</span>
              </li>
            ))}
          </ul> */}
        </div>
      </>
    );
  }, [domain, error, loading, value]);

  return <div className={styles.domainScore}>{content}</div>;
}

function getErrorMessage(error) {
  if (error === 'Not Authorised!') {
    return (
      <span>
        The provided Licence Key is not valid or has been used on too many
        devices.
      </span>
    );
  } else if (error === 'No key!') {
    return <span>No licence key provided.</span>;
  }
}

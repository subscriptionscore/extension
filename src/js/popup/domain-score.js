import React, { useMemo } from 'react';
import Rank from '../components/rank';

import './reset.scss';
import styles from './popup.module.scss';

import useBadge from '../hooks/use-badge';
import useDomainScore from '../hooks/use-domain-score';

export default function DomainScore({ url }) {
  const { value, loading, error, domain } = useDomainScore(url);
  useBadge({ url, data: value ? value.searchDomain : null });

  const content = useMemo(() => {
    if (loading) {
      return <div className={styles.loading}>Loading...</div>;
    }
    const { searchDomain } = value;
    if (!searchDomain || error) {
      return (
        <>
          <div className={styles.avgScore}>
            <h2>
              <Rank compact rank={'unknown'} />
              <span className={styles.title}>{domain}</span>
            </h2>
          </div>
          <div className={styles.empty}>No data for this domain</div>
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
        <div className={styles.addresses}>
          {/* <Score emailScore={scoreData} /> */}
          <ul>
            {scores.map(({ rank, score, email }) => (
              <li key={email}>
                <span>{rank}</span>
                <span>{email}</span>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }, [domain, error, loading, value]);
  return (
    <div className={styles.popup}>
      <div className={styles.domainScore}>{content}</div>
    </div>
  );
}

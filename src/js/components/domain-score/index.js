import React, { useMemo } from 'react';

import Rank from '../rank';
import Score from '../score';
import styles from './domain-score.module.scss';
import useDomainScore from '../../hooks/use-domain-score';

export default function DomainScore({ url, isLoading, colorSet }) {
  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className={styles.domainScore}>
          <div className={styles.avgScore}>
            <h2>
              <Rank compact rank={'unknown'} />
              <span className={styles.title}>Loading...</span>
            </h2>
          </div>
          <div className={styles.content}></div>
        </div>
      );
    }
    return <Content url={url} colorSet={colorSet} />;
  }, [url, isLoading, colorSet]);

  return content;
}

function Content({ url, colorSet }) {
  const { value, loading, error, domain } = useDomainScore(url);

  const { title, content, rank } = useMemo(() => {
    if (loading) {
      return {
        title: 'Loading...',
        content: (
          <span className={styles.spinnerContainer}>
            <span className={styles.spinner} />
          </span>
        ),
        rank: 'unknown'
      };
    }
    if (error) {
      return {
        title: domain,
        content: <div className={styles.empty}>{getErrorMessage(error)}</div>,
        rank: 'unknown'
      };
    }
    const { searchDomain } = value ? value : {};
    if (!searchDomain || !searchDomain.score) {
      return {
        title: domain,
        content: (
          <div className={styles.empty}>
            We don't have enough data to score this website's subscription
            emails yet.
          </div>
        ),
        rank: 'unknown'
      };
    }
    const { rank, domain: normalizedDomain, ...scoreData } = searchDomain;
    return {
      title: normalizedDomain || domain,
      content: (
        <Score emailScore={scoreData} colorblind={colorSet === 'colorblind'} />
      ),
      rank
    };
  }, [loading, error, value, domain, colorSet]);

  return (
    <div className={styles.domainScore}>
      <div className={styles.avgScore}>
        <h2>
          <Rank compact rank={rank} colorblind={colorSet === 'colorblind'} />
          <span className={styles.title}>{title}</span>
        </h2>
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  );
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
  } else if (error.message === 'Failed to fetch') {
    return (
      <span>
        Couldn't connect to Subscription Score servers, please try again later.
      </span>
    );
  }
  console.log(error);
  return <span>Something went wrong :(</span>;
}

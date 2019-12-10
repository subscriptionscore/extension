import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import useGraphql from '../hooks/use-graphql';
import './reset.scss';
import styles from './popup.module.scss';
import { getCurrentTabUrl } from '../utils/tabs';

const gql = `
query Search($domain: String!) {
  searchDomain(domain: $domain) {
    count
    score
    rank
    scores {
        rank
        score
        email
    }
  }
}
`;
const App = ({ domain = 'linkedin.com' }) => {
  getCurrentTabUrl();
  const options = useMemo(
    () => ({
      variables: {
        domain
      }
    }),
    []
  );
  const { value, loading, error } = useGraphql(gql, options);
  console.log(value);
  const content = useMemo(() => {
    if (loading) {
      return <div className={styles.loading}>Loading...</div>;
    }
    const { searchDomain } = value;
    const { rank, domain: normalizedDomain, scores } = searchDomain;
    return (
      <div className={styles.domainScore}>
        <div className={styles.avgScore}>
          <span>{rank}</span>
          <span>{normalizedDomain}</span>
        </div>
        <div className={styles.addresses}>
          <ul>
            {scores.map(({ rank, score, email }) => (
              <li key={email}>
                <span>{rank}</span>
                <span>{email}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }, [loading, value]);
  return (
    <div className={styles.popup}>
      <h2>{domain}</h2>
      {content}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));

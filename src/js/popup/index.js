import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import useCurrentUrl from '../hooks/use-current-url';
import DomainScore from '../components/domain-score';
import styles from './popup.module.scss';
import Footer from './footer/index';
import './reset.scss';

const App = () => {
  const { loading: urlLoading, url } = useCurrentUrl();

  const content = useMemo(() => {
    if (urlLoading) {
      return <span>Loading...</span>;
    }
    return <DomainScore url={url} />;
  }, [url, urlLoading]);

  return (
    <div className={styles.popup}>
      {content}
      <Footer />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));

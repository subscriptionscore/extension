import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import useCurrentUrl from '../hooks/use-current-url';
import DomainScore from '../components/domain-score';
import styles from './popup.module.scss';
import Footer from './footer/index';
import './reset.scss';
import useStorage from '../hooks/use-storage';

const UserWrapper = () => {
  return <App />;
};
const App = () => {
  const { loading: urlLoading, url } = useCurrentUrl();
  const [{ value, loading }] = useStorage();
  const theme = useMemo(() => {
    if (value && value.preferences) {
      return value.preferences.darkMode ? 'dark' : 'light';
    }
  }, [value]);

  return (
    <div data-color-theme={theme}>
      <div className={styles.popup}>
        <DomainScore url={url} isLoading={urlLoading || loading} />
        <Footer />
      </div>
    </div>
  );
};

ReactDOM.render(<UserWrapper />, document.querySelector('#root'));

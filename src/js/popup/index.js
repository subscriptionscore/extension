import './reset.scss';

import React, { useMemo } from 'react';

import DomainScore from '../components/domain-score';
import Footer from './footer/index';
import ReactDOM from 'react-dom';
import styles from './popup.module.scss';
import useCurrentUrl from '../hooks/use-current-url';
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
  const colorSet = useMemo(() => {
    if (value && value.preferences) {
      return value.preferences.colorSet;
    }
  }, [value]);

  return (
    <div data-color-theme={theme}>
      <div className={styles.popup}>
        <DomainScore
          url={url}
          colorSet={colorSet}
          isLoading={urlLoading || loading}
        />
        <Footer />
      </div>
    </div>
  );
};

ReactDOM.render(<UserWrapper />, document.querySelector('#root'));

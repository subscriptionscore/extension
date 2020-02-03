import './reset.scss';

import React, { useEffect, useMemo } from 'react';

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
  const [{ value: storage, loading: storageLoading }] = useStorage();

  const theme = useMemo(() => {
    if (storage && storage.preferences) {
      return storage.preferences.darkMode ? 'dark' : 'light';
    }
  }, [storage]);
  const colorSet = useMemo(() => {
    if (storage && storage.preferences) {
      return storage.preferences.colorSet;
    }
  }, [storage]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#323639';
    } else {
      document.body.style.backgroundColor = '#FFFFFF';
    }
  }, [theme]);

  return (
    <div data-color-theme={theme}>
      <div className={styles.popup}>
        <DomainScore
          url={url}
          colorSet={colorSet}
          isLoading={urlLoading || storageLoading}
        />
        <Footer />
      </div>
    </div>
  );
};

ReactDOM.render(<UserWrapper />, document.querySelector('#root'));

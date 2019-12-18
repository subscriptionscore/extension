import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import useCurrentUrl from '../hooks/use-current-url';
import DomainScore from '../components/domain-score';
import styles from './popup.module.scss';
import Footer from './footer/index';
import './reset.scss';
import UserProvider, { useUser } from '../providers/user-provider';

const UserWrapper = () => {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
};
const App = () => {
  const { loading: urlLoading, url } = useCurrentUrl();
  const [{ user, loading }] = useUser();
  const theme = user.preferences.darkMode ? 'dark' : 'light';

  const content = useMemo(() => {
    if (urlLoading || loading) {
      return null;
    }
    return <DomainScore url={url} />;
  }, [url, urlLoading, loading]);

  return (
    <div data-color-theme={theme}>
      <div className={styles.popup}>
        {content}
        <Footer />
      </div>
    </div>
  );
};

ReactDOM.render(<UserWrapper />, document.querySelector('#root'));

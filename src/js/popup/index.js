import './reset.scss';

import React, { useEffect, useMemo } from 'react';
import UserProvider, { useUser } from '../providers/user-provider';

import DomainScore from '../components/domain-score';
import Footer from './footer/index';
import { FormCheckbox } from '../components/form';
import ReactDOM from 'react-dom';
import styles from './popup.module.scss';
import useCurrentUrl from '../hooks/use-current-url';
import useStorage from '../hooks/use-storage';

const UserWrapper = () => {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
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
  const gmailEnabled = useMemo(() => {
    if (storage && storage.preferences) {
      return storage.preferences.gmailEnabled;
    }
  }, [storage]);
  console.log('gmailEnabled', gmailEnabled);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#323639';
    } else {
      document.body.style.backgroundColor = '#FFFFFF';
    }
  }, [theme]);

  const content = useMemo(() => {
    if (urlLoading) {
      // TODO style this
      return (
        <div className={styles.inner}>
          <p>Loading...</p>
        </div>
      );
    }
    if (isGmail(url)) {
      return <GmailContent gmailEnabled={gmailEnabled} />;
    }
    return (
      <>
        <DomainScore url={url} colorSet={colorSet} isLoading={storageLoading} />
      </>
    );
  }, [colorSet, gmailEnabled, storageLoading, url, urlLoading]);

  return (
    <div data-color-theme={theme}>
      <div className={styles.popup}>{content}</div>
      <Footer />
    </div>
  );
};

function GmailContent({ gmailEnabled }) {
  const [, { setPreference }] = useUser();

  return (
    <div className={styles.inner}>
      <FormCheckbox
        name="gmailEnabled"
        checked={gmailEnabled}
        onChange={() => setPreference({ gmailEnabled: !gmailEnabled })}
        label={
          <span style={{ fontSize: '14px' }}>
            Show mailing list ranks in my inbox
          </span>
        }
      />
    </div>
  );
}

ReactDOM.render(<UserWrapper />, document.querySelector('#root'));

function isGmail(url) {
  return url.includes('mail.google.com');
}

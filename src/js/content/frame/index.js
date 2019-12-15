import './frame.scss';

import React, { useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styles from './popup.module.scss';
import DomainScore from '../../components/domain-score';
import useCurrentUrl from '../../hooks/use-current-url';
import useStorage from '../../hooks/use-storage';
import Button from '../../components/button';

const origin = chrome.runtime.getURL('/frame.html');

const Popup = () => {
  const { loading: urlLoading, url } = useCurrentUrl();
  const [{ value: storage = {}, loading: storageLoading }] = useStorage();

  const onContinue = useCallback(() => {
    console.log('[subscriptionscore]: sending message continue from ', origin);
    window.parent.postMessage({ popupResponse: 'continue' }, '*');
  }, []);
  const onCancel = useCallback(() => {
    console.log('[subscriptionscore]: sending message cancel from ', origin);
    window.parent.postMessage({ popupResponse: 'cancel' }, '*');
  }, []);
  const onIgnoreEmail = useCallback(() => {}, []);
  const onIgnoreSite = useCallback(() => {}, []);

  const content = useMemo(() => {
    if (urlLoading || storageLoading) {
      return null;
    }
    let theme = 'light';
    if (storage.preferences && storage.preferences.darkMode) {
      theme = 'dark';
    }
    return (
      <div className={styles.container} data-color-theme={theme}>
        <div className={styles.popup}>
          <div className={styles.popupHead}>
            🚨 Wait, this looks like a spammy mailing list!
          </div>
          <DomainScore url={url} />
          <div className={styles.popupActions}>
            <Button muted onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onContinue}>Continue anyway →</Button>
          </div>
          <div className={styles.popupOptions}>
            <a onClick={onIgnoreEmail}>Ignore this email address</a>
            <a onClick={onIgnoreSite}>Ignore this site</a>
          </div>
        </div>
      </div>
    );
  }, [
    urlLoading,
    storageLoading,
    storage.preferences,
    url,
    onCancel,
    onContinue,
    onIgnoreEmail,
    onIgnoreSite
  ]);

  return content;
};

ReactDOM.render(<Popup />, document.querySelector('#root'));

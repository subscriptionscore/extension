import './frame.scss';

import React, { useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styles from './popup.module.scss';
import DomainScore from '../../components/domain-score';
import useCurrentUrl from '../../hooks/use-current-url';
import useStorage from '../../hooks/use-storage';
import Button from '../../components/button';
import { Message, Settings } from '../../components/icons';
import useBackground from '../../hooks/use-background';
import useNewTab from '../../hooks/use-new-tab';
import browser from 'browser';

const origin = browser.runtime.getURL('/frame.html');

const Popup = () => {
  const { loading: urlLoading, url } = useCurrentUrl();
  const { value } = useBackground('get-current-rank');
  const domain = value ? value.domain : '';
  const openSettingsPage = useNewTab('/options.html?page=settings');
  const openFeedbackPage = useNewTab(
    `/options.html?page=feedback&domain=${domain}`
  );

  const [{ value: storage = {}, loading: storageLoading }] = useStorage();

  const onContinue = useCallback(() => {
    console.log('[subscriptionscore]: sending message continue from ', origin);
    window.parent.postMessage({ popupResponse: 'continue' }, '*');
  }, []);
  const onCancel = useCallback(() => {
    console.log('[subscriptionscore]: sending message cancel from ', origin);
    window.parent.postMessage({ popupResponse: 'cancel' }, '*');
  }, []);
  const onIgnoreEmail = useCallback(() => {
    window.parent.postMessage({ popupResponse: 'add-ignore-email' }, '*');
  }, []);
  const onIgnoreSite = useCallback(() => {
    window.parent.postMessage(
      { popupResponse: 'add-ignore-site', domain },
      '*'
    );
  }, [domain]);

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

          <ul className={styles.popupOptions}>
            <li>
              <a onClick={onIgnoreEmail}>Ignore this email address</a>
            </li>
            <li>
              <a onClick={onIgnoreSite}>Ignore this site</a>
            </li>
            <li style={{ marginLeft: 'auto' }}>
              <a title="Suggest a correction" onClick={openFeedbackPage}>
                <Message />
              </a>
            </li>
            <li>
              <a title="Settings" onClick={openSettingsPage}>
                <Settings />
              </a>
            </li>
          </ul>
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
    onIgnoreSite,
    openFeedbackPage,
    openSettingsPage
  ]);

  return content;
};

ReactDOM.render(<Popup />, document.querySelector('#root'));

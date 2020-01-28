import './frame.scss';

import { Message, Settings } from '../../components/icons';
import React, { useCallback, useMemo } from 'react';

import Button from '../../components/button';
import DomainScore from '../../components/domain-score';
import ReactDOM from 'react-dom';
import browser from 'browser';
import styles from './popup.module.scss';
import useBackground from '../../hooks/use-background';
import useCurrentUrl from '../../hooks/use-current-url';
import useNewTab from '../../hooks/use-new-tab';
import useStorage from '../../hooks/use-storage';

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
    let colorSet = 'normal';
    let autoAllow = false;
    let autoAllowTimeout = 0;

    if (storage.preferences && storage.preferences.darkMode) {
      theme = 'dark';
    }
    if (storage.preferences.colorset) {
      colorSet = storage.preferences.colorset;
    }
    if (storage.preferences.autoAllow) {
      autoAllow = true;
      autoAllowTimeout = storage.preferences.autoAllowTimeout || 10;
    }

    let continueButton;

    if (autoAllow) {
      const seconds = autoAllowTimeout;
      setTimeout(() => onContinue, seconds * 1000);
      continueButton = (
        <button
          role="button"
          className={styles.continueBtn}
          onClick={onContinue}
        >
          <span
            className={styles.progressBar}
            style={{
              animationDuration: `${seconds}s`
            }}
          />
          <span className={styles.progressText}>Continue anyway →</span>
        </button>
      );
    } else {
      continueButton = <Button onClick={onContinue}>Continue anyway →</Button>;
    }

    return (
      <div className={styles.container} data-color-theme={theme}>
        <div className={styles.popup}>
          <div className={styles.popupHead}>
            🚨 Wait, this looks like a spammy mailing list!
          </div>
          <DomainScore url={url} colorSet={colorSet} />
          <div className={styles.popupActions}>
            <Button muted onClick={onCancel}>
              Cancel
            </Button>
            {continueButton}
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

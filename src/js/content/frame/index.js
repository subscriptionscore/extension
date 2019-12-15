import './frame.scss';
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import styles from './popup.module.scss';
import DomainScore from '../../components/domain-score';
import useCurrentUrl from '../../hooks/use-current-url';
import useStorage from '../../hooks/use-storage';

console.log('HELLO FRAME');

const Popup = () => {
  const { loading: urlLoading, url } = useCurrentUrl();
  const [{ value: storage = {}, loading: storageLoading }] = useStorage();
  const theme = storage.preferences.darkMode ? 'dark' : 'light';

  const content = useMemo(() => {
    if (urlLoading || storageLoading) {
      return <span>Loading...</span>;
    }
    return <DomainScore url={url} />;
  }, [url, urlLoading, storageLoading]);
  return (
    <div className={styles.popup} data-color-theme={theme}>
      <div className={styles.popupHead}>
        Wait, this looks like a spammy mailing list!
      </div>
      {content}
    </div>
  );
};

ReactDOM.render(<Popup />, document.querySelector('#root'));

import React from 'react';
import styles from './footer.module.scss';
import { Settings, Message } from '../../components/icons';
import useNewTab from '../../hooks/use-new-tab';
import useBackground from '../../hooks/use-background';

export default function Footer() {
  const { value } = useBackground('get-current-rank');
  const domain = value ? value.domain : '';
  const openSettingsPage = useNewTab('/options.html?page=settings');
  const openFeedbackPage = useNewTab(
    `/options.html?page=feedback&domain=${domain}`
  );

  return (
    <div className={styles.footer}>
      <ul className={styles.options}>
        <li>
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
  );
}

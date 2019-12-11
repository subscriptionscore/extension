import React from 'react';
import styles from './footer.module.scss';
import { Settings } from '../../components/icons';
import useNewTab from '../../hooks/use-new-tab';

export default function Footer() {
  const openSettingsPage = useNewTab('/options.html');
  return (
    <div className={styles.footer}>
      <ul className={styles.options}>
        <li>
          <a title="Settings" onClick={openSettingsPage}>
            <Settings />
          </a>
        </li>
      </ul>
    </div>
  );
}

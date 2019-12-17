import React, { useMemo, useState } from 'react';
import styles from './layout.module.scss';

import About from './about';
import Appearance from './appearance';
import Billing from './billing';
import Preferences from './preferences';
import cx from '../../utils/classnames';
import logo from '../../../../assets/logo.png';
import { VERSION_NAME } from '../../constants';

const NAV_ITEMS = [
  {
    label: 'Billing',
    value: 'billing'
  },
  {
    label: 'Appearance',
    value: 'appearance'
  },
  {
    label: 'Preferences',
    value: 'preferences'
  },
  {
    label: 'About',
    value: 'about'
  }
];

const Layout = () => {
  const [page, setPage] = useState(NAV_ITEMS[0].value);

  const content = useMemo(() => {
    if (page === 'billing') {
      return <Billing />;
    }
    if (page === 'appearance') {
      return <Appearance />;
    }
    if (page === 'preferences') {
      return <Preferences />;
    }
    if (page === 'about') {
      return <About />;
    }
  }, [page]);

  return (
    <div className={styles.container}>
      <div className={styles.nav} role="nav">
        <ul>
          {NAV_ITEMS.map(item => {
            const classes = cx({
              [styles.navLink]: true,
              [styles.navActive]: page === item.value
            });
            return (
              <li key={item.value} className={styles.navItem}>
                <a className={classes} onClick={() => setPage(item.value)}>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <div className={styles.meta}>
          <a href="https://subscriptionscore.com">
            <img className={styles.logo} src={logo} alt="Logo" />
          </a>

          <span className={styles.version}>{VERSION_NAME}</span>
        </div>
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default Layout;

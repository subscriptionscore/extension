import React, { useEffect, useMemo, useState } from 'react';

import About from './about';
import Appearance from './appearance';
import Billing from './billing';
import Feedback from './feedback';
import Preferences from './preferences';
import cx from '../../utils/classnames';

import logo from '../../../../assets/logo.png';
import { VERSION_NAME } from '../../constants';

import styles from './layout.module.scss';

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
  },
  {
    label: 'Feedback',
    value: 'feedback'
  }
];

const Layout = () => {
  const [page, setPage] = useState(NAV_ITEMS[0].value);
  const [params, setParams] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const page = urlParams.get('page');
    const domain = urlParams.get('domain');

    if (page && NAV_ITEMS.find(n => n.value === page)) {
      setPage(page);
    }
    if (domain) {
      setParams({ domain });
    }
  }, []);

  useEffect(() => {
    console.log('page changed', page);
    window.history.replaceState({}, '', `?page=${page}`);
  }, [page]);

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
    if (page === 'feedback') {
      return <Feedback params={params} />;
    }
    if (page === 'about') {
      return <About />;
    }
  }, [page, params]);

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

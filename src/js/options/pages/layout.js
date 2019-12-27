import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '../../providers/user-provider';
import About from './about';
import Appearance from './appearance';
import Billing from './billing';
import Feedback from './feedback';
import Preferences from './preferences';
import { VERSION_NAME } from '../../constants';
import cx from '../../utils/classnames';
import logo from '../../../../assets/logo.png';
import styles from './layout.module.scss';
import Emails from './emails';

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
    label: 'Black Hole',
    value: 'emails',
    feature: 'emails'
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

const Options = () => {
  const [page, setPage] = useState(NAV_ITEMS[0].value);
  const [params, setParams] = useState({});
  const [{ user, loaded }] = useUser();
  const { licenceKey, features } = user;

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
    window.history.replaceState({}, '', `?page=${page}`);
  }, [page]);

  const content = useMemo(() => {
    if (page === 'billing') {
      const showWelcome = !licenceKey;
      return <Billing showWelcome={showWelcome} />;
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
    if (page === 'emails') {
      return <Emails />;
    }
  }, [page, params, licenceKey]);

  const navItems = NAV_ITEMS.filter(n =>
    n.feature ? features.includes(n.feature) : true
  );
  return (
    <div className={styles.container}>
      <div className={styles.nav} role="nav">
        <ul data-welcome={!licenceKey}>
          {navItems.map(item => {
            const classes = cx({
              [styles.navLink]: true,
              [styles.navActive]: page === item.value
            });
            return (
              <li
                key={item.value}
                className={styles.navItem}
                data-nav={item.value}
              >
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

export default Options;

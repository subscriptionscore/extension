import React, { useMemo, useState } from 'react';

import Appearance from './appearance';
import Billing from './billing';
import Preferences from './preferences';
import styles from './layout.module.scss';
import cx from '../../utils/classnames';

const NAV_ITEMS = [
  {
    label: 'Appearance',
    value: 'appearance'
  },
  {
    label: 'Preferences',
    value: 'preferences'
  },
  {
    label: 'Billing',
    value: 'billing'
  }
];

const Layout = () => {
  const [page, setPage] = useState('appearance');

  const content = useMemo(() => {
    if (page === 'appearance') {
      return <Appearance />;
    }
    if (page === 'preferences') {
      return <Preferences />;
    }
    if (page === 'billing') {
      return <Billing />;
    }
  }, [page]);

  return (
    <div className={styles.container}>
      <ul className={styles.nav}>
        {NAV_ITEMS.map(item => {
          const classes = cx({
            [styles.link]: true,
            [styles.active]: page === item.value
          });
          return (
            <li key={item.value} className={styles.item}>
              <a className={classes} onClick={() => setPage(item.value)}>
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default Layout;

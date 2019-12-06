import React, { useCallback, useMemo, useReducer } from 'react';
import reducer, { initialState } from './reducer';

import Appearance from './appearance';
import Billing from './billing';
import Preferences from './preferences';
import styles from './options.module.scss';

const OptionPages = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  console.log('state', state);

  const content = useMemo(() => {
    if (state.page === 'appearance') {
      return <Appearance />;
    }
    if (state.page === 'preferences') {
      return <Preferences />;
    }
    if (state.page === 'billing') {
      return <Billing />;
    }
  }, [state.page]);

  const changePage = useCallback(
    page => {
      dispatch({ type: 'set-page', data: page });
    },
    [dispatch]
  );

  return (
    <div className={styles.options}>
      <ul className={styles.nav}>
        <li className={styles.navItem}>
          <a onClick={() => changePage('appearance')}>Appearance</a>
        </li>
        <li className={styles.navItem}>
          <a onClick={() => changePage('preferences')}>Preferences</a>
        </li>
        <li className={styles.navItem}>
          <a onClick={() => changePage('billing')}>Billing</a>
        </li>
      </ul>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default OptionPages;

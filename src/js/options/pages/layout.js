import React, { createContext, useCallback, useMemo, useReducer } from 'react';
import reducer, { initialState } from './reducer';

import Appearance from './appearance';
import Billing from './billing';
import Preferences from './preferences';
import cx from 'classnames';
import styles from './layout.module.scss';

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

export const OptionsContext = createContext({ state: initialState });

const Layout = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
    <OptionsContext.Provider value={{ state, dispatch }}>
      <div className={styles.container}>
        <ul className={styles.nav}>
          {NAV_ITEMS.map(item => {
            const classes = cx({
              [styles.link]: true,
              [styles.active]: state.page === item.value
            });
            return (
              <li key={item.value} className={styles.item}>
                <a className={classes} onClick={() => changePage(item.value)}>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <div className={styles.content}>{content}</div>
      </div>
    </OptionsContext.Provider>
  );
};

export default Layout;

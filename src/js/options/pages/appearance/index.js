import React, { useCallback } from 'react';

import { FormCheckbox } from '../../../components/form';
import Rank from '../../../components/rank';
import styles from './appearance.module.scss';
import { useUser } from '../../../providers/user-provider';
import Radio from '../../../components/radio';

const AppearancePage = () => {
  return (
    <>
      <h1>Appearance</h1>
      <Colors />
    </>
  );
};

export default AppearancePage;

function Colors() {
  const [{ user }, dispatch] = useUser();

  const { colorSet, darkMode } = user.preferences;

  const onChangeDarkMode = useCallback(() => {
    dispatch({ type: 'save-preference', data: { darkMode: !darkMode } });
  }, [darkMode, dispatch]);

  return (
    <form>
      <div className={styles.pageSection}>
        <h2>Colors</h2>
        <Radio
          name="colors-radio"
          checked={colorSet === 'normal'}
          onChange={() =>
            dispatch({ type: 'save-preference', data: { colorSet: 'normal' } })
          }
        >
          <div className={styles.ranks}>
            <Ranks colorblind={false} />
          </div>
        </Radio>
        <Radio
          name="colors-radio"
          checked={colorSet === 'colorblind'}
          onChange={() =>
            dispatch({
              type: 'save-preference',
              data: { colorSet: 'colorblind' }
            })
          }
        >
          <div className={styles.ranks}>
            <Ranks colorblind={true} />
          </div>
        </Radio>
      </div>

      <div className={styles.pageSection}>
        <div className={styles['dark-mode']}>
          <FormCheckbox
            name="darkMode"
            checked={darkMode}
            onChange={onChangeDarkMode}
            label={<h2>Dark mode</h2>}
          />
        </div>
      </div>
    </form>
  );
}

function Ranks({ colorblind }) {
  return ['A+', 'A', 'B', 'C', 'D', 'E', 'F'].map(rank => (
    <div key={rank} className={styles.rank}>
      <Rank rank={rank} colorblind={colorblind} />
    </div>
  ));
}

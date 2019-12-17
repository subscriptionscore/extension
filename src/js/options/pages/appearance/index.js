import React, { useCallback } from 'react';

import { FormCheckbox } from '../../../components/form';
import Radio from '../../../components/radio';
import Rank from '../../../components/rank';
import styles from './appearance.module.scss';
import { useUser } from '../../../providers/user-provider';

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
          className={styles.colors}
          name="colors-radio"
          checked={colorSet === 'normal'}
          onChange={() =>
            dispatch({ type: 'save-preference', data: { colorSet: 'normal' } })
          }
        >
          <div className={styles.ranks}>
            <Ranks colorblind={false} />
          </div>
          <span className={styles.desc}>Chromatic Palette</span>
        </Radio>

        <Radio
          className={styles.colors}
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
          <span className={styles.desc}>Colorblind-friendly Palette</span>
        </Radio>
      </div>

      <div className={styles.pageSection}>
        <div className={styles['dark-mode']}>
          <FormCheckbox
            name="darkMode"
            checked={darkMode}
            onChange={onChangeDarkMode}
            label="Dark mode"
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

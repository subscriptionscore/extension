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
  const [{ user }, { setPreference }] = useUser();

  const { colorSet, darkMode } = user.preferences;

  const onChangeDarkMode = useCallback(() => {
    setPreference({ darkMode: !darkMode });
  }, [darkMode, setPreference]);

  return (
    <form
      id="colors-form"
      onSubmit={e => {
        e.preventDefault();
        return false;
      }}
    >
      <div className={styles.pageSection}>
        <h2>Colors</h2>

        <Radio
          className={styles.colors}
          name="colors-radio"
          checked={colorSet === 'normal'}
          onChange={() => setPreference({ colorSet: 'normal' })}
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
          onChange={() => setPreference({ colorSet: 'colorblind' })}
        >
          <div className={styles.ranks}>
            <Ranks colorblind={true} />
          </div>
          <span className={styles.desc}>Colorblind-friendly Palette</span>
        </Radio>
      </div>

      <div className={styles.pageSection}>
        <FormCheckbox
          name="darkMode"
          checked={darkMode}
          onChange={onChangeDarkMode}
          label="Dark mode"
        />
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

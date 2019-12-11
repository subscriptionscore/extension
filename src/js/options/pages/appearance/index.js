import React, { useCallback } from 'react';

import { FormCheckbox } from '../../../components/form';
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
  const [{ settings }, dispatch] = useUser();

  const { colorSet, darkMode } = settings;

  const onChangeDarkMode = useCallback(() => {
    dispatch({ type: 'save-setting', data: { darkMode: !darkMode } });
  }, [darkMode, dispatch]);

  return (
    <form>
      <div className={styles.section}>
        <h2>Colors</h2>
        <Radio
          type={'normal'}
          checked={colorSet === 'normal'}
          onChange={() =>
            dispatch({ type: 'save-setting', data: { colorSet: 'normal' } })
          }
        />
        <Radio
          type={'colorblind'}
          checked={colorSet === 'colorblind'}
          onChange={() =>
            dispatch({ type: 'save-setting', data: { colorSet: 'colorblind' } })
          }
        />
      </div>

      <div className={styles.section}>
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

function Radio({ type = 'normal', checked, onChange }) {
  return (
    <label>
      <input
        type="radio"
        name="colors-radio"
        className={styles.radio}
        spellCheck="false"
        checked={checked}
        onChange={onChange}
      />
      <div className={styles.ranks}>
        <Ranks colorblind={type === 'colorblind'} />
      </div>
    </label>
  );
}

function Ranks({ colorblind }) {
  return ['A+', 'A', 'B', 'C', 'D', 'E', 'F'].map(rank => (
    <div key={rank} className={styles.rank}>
      <Rank rank={rank} colorblind={colorblind} />
    </div>
  ));
}

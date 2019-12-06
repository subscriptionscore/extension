import { FormCheckbox } from '../../../../components/form';
import Rank from '../../../../components/rank';
import React from 'react';
import styles from './colors.module.scss';

const Colors = ({ settings, onChange }) => {
  const { colorSet, darkMode } = settings;

  return (
    <form>
      <div className={styles.section}>
        <h2>Colors</h2>
        <Radio
          type={'normal'}
          checked={colorSet === 'normal'}
          onChange={() => onChange({ colorSet: 'normal' })}
        />
        <Radio
          type={'colorblind'}
          checked={colorSet === 'colorblind'}
          onChange={() => onChange({ colorSet: 'colorblind' })}
        />
      </div>

      <div className={styles.section}>
        <div className={styles['dark-mode']}>
          <FormCheckbox
            name="darkMode"
            checked={darkMode}
            onChange={() => onChange({ darkMode: !darkMode })}
            label={<h2>Dark mode</h2>}
          />
        </div>
      </div>
    </form>
  );
};

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

export default Colors;

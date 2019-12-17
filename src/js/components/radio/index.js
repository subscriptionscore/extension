import React from 'react';
import styles from './radio.module.scss';

const Radio = ({ checked, name, children, onChange }) => {
  return (
    <label>
      <input
        type="radio"
        name={name}
        className={styles.radio}
        spellCheck="false"
        checked={checked}
        onChange={onChange}
      />
      {children}
    </label>
  );
};

export default Radio;

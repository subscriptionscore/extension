import React from 'react';
import styles from './form.module.scss';

export const FormCheckbox = ({ id, name, label, ...props }) => {
  return (
    <label>
      <input
        {...props}
        id={id}
        type="checkbox"
        name={name}
        className={styles.checkbox}
        spellCheck="false"
      />
      <span className={styles['checkbox-label']}>{label}</span>
    </label>
  );
};

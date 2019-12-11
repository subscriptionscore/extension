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

export const FormInput = ({ id, name, label, ...props }) => {
  return (
    <input
      {...props}
      id={id}
      type="text"
      name={name}
      className={styles.input}
      spellCheck="false"
    />
  );
};

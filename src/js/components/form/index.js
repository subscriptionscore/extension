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

export const FormInput = ({ id, name, type = 'text', ...props }) => {
  return (
    <input
      {...props}
      id={id}
      type={type}
      name={name}
      className={styles.input}
      spellCheck="false"
    />
  );
};

export const FormError = ({ children }) => (
  <div className={styles['form-error']}>
    <span>{children}</span>
  </div>
);

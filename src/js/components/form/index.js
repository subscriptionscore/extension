import React from 'react';
import cx from '../../utils/classnames';
import styles from './form.module.scss';

export const FormCheckbox = ({ id, name, label, ...props }) => {
  return (
    <label className={styles.checkboxWrapper}>
      <input
        {...props}
        id={id}
        type="checkbox"
        name={name}
        className={styles.checkbox}
        spellCheck="false"
      />
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  );
};

export const FormInput = ({
  id,
  name,
  className = '',
  type = 'text',
  label,
  ...props
}) => {
  const classes = cx({
    [className]: true,
    [styles.input]: true
  });
  return (
    <>
      <span className={styles.inputWrapper}>
        {label ? (
          <label htmlFor={name} className={styles.inputLabel}>
            {label}
          </label>
        ) : null}
        <input
          {...props}
          id={id}
          type={type}
          name={name}
          className={classes}
          spellCheck="false"
        />
      </span>
    </>
  );
};

export const FormTextarea = ({ id, name, label, rows = '2', ...props }) => {
  return (
    <>
      {label ? (
        <label htmlFor={name} className={styles.inputLabel}>
          {label}
        </label>
      ) : null}
      <textarea
        {...props}
        id={id}
        name={name}
        rows={rows}
        className={styles.textarea}
        spellCheck="false"
      />
    </>
  );
};

export const FormError = ({ children }) => (
  <div className={styles.formError}>
    <span>{children}</span>
  </div>
);

export const FormSuccess = ({ children }) => (
  <div className={styles.formSuccess}>
    <span>{children}</span>
  </div>
);
export const InputGroup = ({ children }) => (
  <div className={styles.inputGroup}>{children}</div>
);

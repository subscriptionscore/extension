import React from 'react';
import cx from '../../utils/classnames';
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

export const FormInput = ({
  id,
  name,
  className = '',
  type = 'text',
  ...props
}) => {
  const classes = cx({
    [className]: true,
    [styles.input]: true
  });
  return (
    <input
      {...props}
      id={id}
      type={type}
      name={name}
      className={classes}
      spellCheck="false"
    />
  );
};

export const FormError = ({ children }) => (
  <div className={styles.formError}>
    <span>{children}</span>
  </div>
);
export const InputGroup = ({ children }) => (
  <div className={styles.inputGroup}>{children}</div>
);

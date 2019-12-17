import React from 'react';
import styles from './radio.module.scss';
import classnames from '../../utils/classnames';

const Radio = ({
  checked,
  vertical,
  className = '',
  name,
  children,
  onChange
}) => {
  const classes = classnames({
    [styles.radio]: true,
    [styles.vertical]: vertical,
    [className]: !!className
  });
  return (
    <label className={classes}>
      <input
        type="radio"
        name={name}
        spellCheck="false"
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.label}>{children}</span>
    </label>
  );
};

export default Radio;

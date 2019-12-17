import React from 'react';
import classnames from '../../utils/classnames';
import styles from './radio.module.scss';

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

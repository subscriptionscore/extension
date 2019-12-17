import React from 'react';
import cx from '../../utils/classnames';
import styles from './alerts.module.scss';

const Alert = ({ children, onDismiss = () => {}, success, error }) => {
  const classes = cx({
    [styles.alert]: true,
    [styles.success]: success,
    [styles.error]: error
  });

  return (
    <div className={classes}>
      <span className={styles.content}>{children}</span>
      <a className={styles.close} onClick={onDismiss}>
        x
      </a>
    </div>
  );
};

export default Alert;

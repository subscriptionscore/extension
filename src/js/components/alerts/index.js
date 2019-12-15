import React from 'react';
import cx from '../../utils/classnames';
import styles from './alerts.module.scss';

const Alert = ({ children, error }) => {
  const classes = cx({
    [styles.alert]: true,
    [styles.error]: error
  });

  return <div className={classes}>{children}</div>;
};

export default Alert;

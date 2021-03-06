import React from 'react';
import cx from '../../utils/classnames';
import styles from './button.module.scss';

const Button = ({
  children,
  onClick,
  as = 'a',
  loading = false,
  muted = false,
  smaller,
  outlined = false,
  className = '',
  ...btnProps
}) => {
  const classes = cx({
    [className]: true,
    [styles.btn]: true,
    [styles.loading]: loading,
    [styles.muted]: muted,
    [styles.smaller]: smaller,
    [styles.outlined]: outlined
  });
  if (as === 'a') {
    return (
      <a role="button" onClick={onClick} className={classes} {...btnProps}>
        <span className={styles.content}>{children}</span>
        {loading && <span className={styles.pulse} />}
      </a>
    );
  }
  return (
    <button role="button" className={classes} {...btnProps}>
      <span className={styles.content}>{children}</span>
      {loading && <span className={styles.pulse} />}
    </button>
  );
};

export default Button;

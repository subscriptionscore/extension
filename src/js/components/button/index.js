import React from 'react';
import styles from './button.module.scss';

const Button = ({ children, onClick, as = 'a', ...elProps }) => {
  if (as === 'a') {
    return (
      <a role="button" onClick={onClick} className={styles.btn} {...elProps}>
        {children}
      </a>
    );
  }
  return (
    <button role="button" className={styles.btn} {...elProps}>
      {children}
    </button>
  );
};

export default Button;

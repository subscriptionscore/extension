import React from 'react';
import styles from './text.module.scss';

export const TextLink = ({ children, ...props }) => (
  <a className={styles.textLink} {...props}>
    {children}
  </a>
);

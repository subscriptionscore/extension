import React from 'react';
import styles from './icons.module.scss';

export function Settings({ width = 16, height = 16 }) {
  return (
    <svg
      className={styles.settings}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M13 2 L13 6 11 7 8 4 4 8 7 11 6 13 2 13 2 19 6 19 7 21 4 24 8 28 11 25 13 26 13 30 19 30 19 26 21 25 24 28 28 24 25 21 26 19 30 19 30 13 26 13 25 11 28 8 24 4 21 7 19 6 19 2 Z" />
      <circle cx="16" cy="16" r="4" />
    </svg>
  );
}

export function Message({ width = 16, height = 16 }) {
  return (
    <svg
      className={styles.message}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    >
      <path d="M2 4 L30 4 30 22 16 22 8 29 8 22 2 22 Z" />
    </svg>
  );
}

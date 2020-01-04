import React from 'react';
import styles from './icons.module.scss';

export function Arrow({ width = 16, height = 16 }) {
  return (
    <svg
      className={styles.arrow}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      fill="none"
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    >
      <path d="M22 6 L30 16 22 26 M30 16 L2 16" />
    </svg>
  );
}
export function ReplyArrow({ width = 16, height = 16 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      fill="none"
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    >
      <path d="M10 6 L3 14 10 22 M3 14 L18 14 C26 14 30 18 30 26" />
    </svg>
  );
}
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

export const TwitterIcon = ({ width = 20, height = 20 }) => (
  <svg viewBox="0 0 64 64" width={width} height={height}>
    <path
      strokeWidth="0"
      fill="currentColor"
      d="M60 16 L54 17 L58 12 L51 14 C42 4 28 15 32 24 C16 24 8 12 8 12 C8 12 2 21 12 28 L6 26 C6 32 10 36 17 38 L10 38 C14 46 21 46 21 46 C21 46 15 51 4 51 C37 67 57 37 54 21 Z"
    />
  </svg>
);

export const FacebookIcon = ({ width = 20, height = 20 }) => (
  <svg role="img" viewBox="0 0 24 24" width={width} height={height}>
    <path
      fill="currentColor"
      d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z"
    />
  </svg>
);

export const LinkedInIcon = ({ width = 20, height = 20 }) => (
  <svg version="1.1" viewBox="0 0 172 172" width={width} height={height}>
    <g
      fill="none"
      fillRule="nonzero"
      stroke="none"
      strokeWidth="1"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit="10"
      strokeDasharray=""
      strokeDashoffset="0"
      fontFamily="none"
      fontWeight="none"
      fontSize="none"
      textAnchor="none"
    >
      <path d="M0,172v-172h172v172z" fill="none" />
      <g fill="currentColor">
        <path d="M136.16667,21.5h-100.33333c-7.91917,0 -14.33333,6.41417 -14.33333,14.33333v100.33333c0,7.91917 6.41417,14.33333 14.33333,14.33333h100.33333c7.91917,0 14.33333,-6.41417 14.33333,-14.33333v-100.33333c0,-7.91917 -6.41417,-14.33333 -14.33333,-14.33333zM64.5,121.83333h-18.0815v-50.16667h18.0815zM55.14033,62.47183c-5.5255,0 -9.21633,-3.68367 -9.21633,-8.6c0,-4.91633 3.68367,-8.6 9.8255,-8.6c5.5255,0 9.21633,3.68367 9.21633,8.6c0,4.91633 -3.68367,8.6 -9.8255,8.6zM129,121.83333h-17.501v-27.41967c0,-7.58233 -4.6655,-9.331 -6.41417,-9.331c-1.74867,0 -7.58233,1.16817 -7.58233,9.331c0,1.16817 0,27.41967 0,27.41967h-18.0815v-50.16667h18.0815v7.00183c2.32917,-4.085 6.99467,-7.00183 15.74517,-7.00183c8.7505,0 15.75233,7.00183 15.75233,22.747z" />
      </g>
    </g>
  </svg>
);

import React from 'react';
import cx from '../../utils/classnames';
import styles from './rank.module.scss';

const Rank = ({ rank = 'A+', compact, colorblind = false }) => {
  return (
    <div className={styles.rank}>
      <span
        data-rank={rank}
        className={cx({
          [styles.value]: true,
          [styles.colorblind]: colorblind,
          [styles.compact]: compact
        })}
      >
        {rank === 'unknown' ? '?' : rank}
      </span>
    </div>
  );
};

export default Rank;

import React from 'react';
import cx from 'classnames';
import styles from './rank.module.scss';

const Rank = ({ rank = 'A+', colorblind = false }) => {
  return (
    <div className={styles.rank}>
      <span
        data-rank={rank}
        className={cx({
          [styles.value]: true,
          [styles.normal]: !colorblind,
          [styles.colorblind]: colorblind
        })}
      >
        {rank}
      </span>
    </div>
  );
};

export default Rank;

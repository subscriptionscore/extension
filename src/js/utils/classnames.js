// Utility function for combining classnames into a
// common format using boolean flags
//
// eg.
// import cx from 'utils/classnames';
// import styles from './styles.module.scss
//
// const classes = cx({
//   [styles.text]: true
//   [styles.bold]: isBold,
//   [styles.light]: isLight
// });
// classes -> `text bold light`;
//
export default classnames => {
  return Object.keys(classnames).reduce((classstr, name) => {
    if (classnames[name]) {
      return `${classstr} ${name}`;
    }
    return `${classstr}`;
  }, '');
};

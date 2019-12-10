export default classnames => {
  return Object.keys(classnames).reduce((classstr, name) => {
    if (classnames[name]) {
      return `${classstr} ${name}`;
    }
    return `${classstr}`;
  }, '');
};

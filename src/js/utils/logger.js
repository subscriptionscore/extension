const prefix = `[subscriptionscore]:`;
let isDev;
if (process) {
  isDev = process.env.NODE_ENV !== 'production';
}
let isDebug = localStorage.getItem('subscore-debug');
if (isDebug || isDev) {
  console.debug(`${prefix} enabled debug logs`);
}

export default (...args) => {
  if (isDebug || isDev) {
    console.debug.apply(console, [prefix, ...args]);
  }
};

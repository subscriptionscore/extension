/**
 * Simple console logger.
 *
 * To enable on a webpage;
 *  localStorage.setItem('subscore-debug', true);
 */
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

export function errorLogger(...args) {
  console.error.apply(console, [prefix, ...args]);
}

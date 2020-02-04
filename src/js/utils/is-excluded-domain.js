/**
 * There are some domains we don't want to run the
 * content script for, we check for these here.
 *
 * Right now we only exclude localhost domains;
 *   localhost - commonly used reference to the local network interface
 *   *.local   - tld commonly used for localhost domains on osx
 *
 * @param {String} url
 */
export default function isExcludedDomain(url) {
  const { hostname: domain } = new URL(url);
  if (domain === 'localhost' || domain.endsWith('.local')) {
    return true;
  }
  return false;
}

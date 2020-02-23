import { errorLogger } from './logger';

export default function digest(data, algo = 'SHA-256') {
  // if the site is not HTTPS then crypto.subtle will be
  // undefined. So if the ext is being used on HTTP we
  // just wont pass around data that should be encrypted
  if (!crypto.subtle) {
    return Promise.resolve('');
  }
  return crypto.subtle
    .digest(algo, new TextEncoder().encode(data))
    .then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
      const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join(''); // convert bytes to hex string
      return hashHex;
    })
    .catch(err => errorLogger('Failed to run hash.', err));
}

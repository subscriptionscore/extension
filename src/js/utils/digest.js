export default async function digest(data, algo = 'SHA-256') {
  // if the site is not HTTPS then crypto.subtle will be
  // undefined. So if the ext is being used on HTTP we
  // just wont pass around data that should be encrypted
  if (!crypto.subtle) {
    return '';
  }
  const hashBuffer = await crypto.subtle.digest(
    algo,
    new TextEncoder().encode(data)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

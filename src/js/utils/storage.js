export function setItem(data) {
  return new Promise(resolve => {
    chrome.storage.sync.set(data, () => {
      return resolve(data);
    });
  });
}

export function getItem(key) {
  return new Promise(resolve => {
    chrome.storage.sync.get([key], result => {
      const data = result[key];
      return resolve(data);
    });
  });
}

export function getItems() {
  return new Promise(resolve => {
    // pass in null to get the entire contents of storage.
    chrome.storage.sync.get(null, result => {
      const data = result;
      return resolve(data);
    });
  });
}

export async function getPreference(pref) {
  const preferences = await getItem('preferences');
  if (!preferences) return null;
  return preferences[pref];
}

export async function getLicenceKey() {
  const licenceKey = await getItem('licenceKey');
  return licenceKey;
}

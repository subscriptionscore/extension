chrome.storage.onChanged.addListener(function(changes, namespace) {
  chrome.runtime.sendMessage({
    action: 'log',
    data: `Changes to storage ${namespace}`
  });
  chrome.runtime.sendMessage({
    action: 'log',
    data: changes
  });
});
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

export async function pushPreference(pref, value) {
  const newValues = value.length ? value : [value];
  const preferences = await getItem('preferences');
  const arr = preferences[pref];
  const newArr = [...arr, ...newValues];
  const newPrefs = {
    preferences: {
      ...preferences,
      [pref]: newArr
    }
  };
  console.log('[subscriptionscore]: updating prefs', newPrefs);
  return setItem(newPrefs);
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

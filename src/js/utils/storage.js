export function getStoredData() {
  return new Promise(resolve => {
    chrome.storage.sync.get(['subscriptionscore'], result => {
      const data = result['subscriptionscore'];
      console.log('[storage]: got subscriptionscore', data);
      return resolve(data);
    });
  });
}

export async function getPreference(pref) {
  const data = await getStoredData();
  if (!data) return null;
  const { preferences } = data;
  return preferences[pref];
}

export async function getLicenceKey() {
  const data = await getStoredData();
  if (!data) return null;
  return data.licenceKey;
}

export function setStoredData(data) {
  return new Promise(resolve => {
    chrome.storage.sync.set({ subscriptionscore: data }, () => {
      console.log('[storage]: set subscriptionscore', data);
      return resolve(data);
    });
  });
}

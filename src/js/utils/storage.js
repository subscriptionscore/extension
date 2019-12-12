export function getStoredData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['subscriptionscore'], result => {
      const data = result['subscriptionscore'];
      console.log('[storage]: got subscriptionscore', data);
      if (!data) {
        return reject();
      }
      return resolve(data);
    });
  });
}

// export async function getPreference(pref) {
//   const prefs = await getPreferences();
//   if (!prefs) return null;
//   return prefs[pref];
// }

export function setStoredData(data) {
  return new Promise(resolve => {
    chrome.storage.sync.set({ subscriptionscore: data }, () => {
      console.log('[storage]: set subscriptionscore', data);
      return resolve(data);
    });
  });
}

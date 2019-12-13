export function getPreferences() {
  return new Promise(resolve => {
    chrome.storage.sync.get(['preferences'], result => {
      const prefs = result['preferences'];
      console.log('[storage]: got preferences', prefs);
      return resolve(prefs);
    });
  });
}

export async function getPreference(pref) {
  const prefs = await getPreferences();
  if (!prefs) return null;
  return prefs[pref];
}

export function setPreferences(prefs) {
  return new Promise(resolve => {
    chrome.storage.sync.set({ preferences: prefs }, () => {
      console.log('[storage]: set preferences', prefs);
      return resolve(prefs);
    });
  });
}

import { getItem, setItem } from 'browser/storage';

import logger from './logger';

export {
  getItem,
  setItem,
  getItems,
  onStorageChange,
  removeOnStorageChange
} from 'browser/storage';

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
  logger('updating prefs', newPrefs);
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

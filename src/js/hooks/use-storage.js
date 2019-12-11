import { useCallback, useEffect, useMemo, useState } from 'react';

function useStorage(query) {
  const [state, setState] = useState({
    loading: true,
    value: null,
    error: null
  });

  useEffect(() => {
    setState({ loading: true });
    getPreferences()
      .then(response => {
        setState({ loading: false, value: response });
      })
      .catch(err => {
        setState({ loading: false, error: err });
      });
  }, [query]);

  const set = useCallback(async data => {
    const newPrefs = await setPreferences(data);
    setState({ value: newPrefs });
  }, []);

  const value = useMemo(() => [state, set], [state, set]);
  return value;
}

function getPreferences() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['preferences'], result => {
      const prefs = result['preferences'];
      console.log('[storage]: got preferences', prefs);
      if (!prefs) {
        return reject();
      }
      return resolve(prefs);
    });
  });
}

function setPreferences(prefs) {
  return new Promise(resolve => {
    chrome.storage.sync.set({ preferences: prefs }, () => {
      console.log('[storage]: set preferences', prefs);
      return resolve(prefs);
    });
  });
}

export default useStorage;

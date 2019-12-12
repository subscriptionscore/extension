import { getPreferences, setPreferences } from '../utils/preferences';
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

export default useStorage;

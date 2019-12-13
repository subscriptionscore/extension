import { getStoredData, setStoredData } from '../utils/storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

function useStorage(query) {
  const [state, setState] = useState({
    loading: true,
    value: null,
    error: null
  });

  useEffect(() => {
    setState({ loading: true });
    getStoredData()
      .then(response => {
        setState({ loading: false, value: response });
      })
      .catch(err => {
        setState({ loading: false, error: err });
      });
  }, [query]);

  const set = useCallback(async data => {
    const newData = await setStoredData(data);
    setState({ value: newData });
  }, []);

  const value = useMemo(() => [state, set], [state, set]);
  return value;
}

export default useStorage;

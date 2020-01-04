import { getItems, setItem } from '../utils/storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

function useStorage() {
  const [state, setState] = useState({
    loading: true,
    value: {},
    error: null
  });

  useEffect(() => {
    setState({ loading: true });
    getItems()
      .then(response => {
        setState({ loading: false, value: response });
      })
      .catch(err => {
        setState({ loading: false, error: err });
      });
  }, []);

  const set = useCallback(async data => {
    await setItem(data);
    setState({
      value: data
    });
  }, []);

  const value = useMemo(() => [state, set], [state, set]);
  return value;
}

export default useStorage;

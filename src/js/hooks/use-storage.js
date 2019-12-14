import { getItems, setItem } from '../utils/storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

function useStorage() {
  const [state, setState] = useState({
    loading: true,
    value: null,
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
    const newData = await setItem(data);
    setState({
      value: newData
    });
  }, []);

  const value = useMemo(() => [state, set], [state, set]);
  return value;
}

export default useStorage;

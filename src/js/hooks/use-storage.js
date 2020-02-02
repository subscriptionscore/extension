import {
  getItems,
  onStorageChange,
  removeOnStorageChange,
  setItem
} from '../utils/storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

function useStorage() {
  const [state, setState] = useState({
    loading: true,
    value: {},
    error: null
  });

  useEffect(() => {
    function handleChange(v) {
      console.log('use-storage: on storage change', v);
      console.log('current state:', state.value);
      let newState = state.value;
      if (v.preferences) {
        newState = {
          ...newState,
          preferences: v.preferences.newValue
        };
      }
      if (v.licenceKey) {
        newState = {
          ...newState,
          licenceKey: v.licenceKey.newValue
        };
      }
      console.log('setting storage state to', newState);
      debugger;
      setState({ value: newState });
    }

    onStorageChange(handleChange);

    return function cleanup() {
      return removeOnStorageChange(handleChange);
    };
  }, [state.value]);

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

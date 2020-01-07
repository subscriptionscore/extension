import { useEffect, useState } from 'react';
import browser from 'browser';

const useBackground = action => {
  const [state, set] = useState({ loading: true, value: null });
  useEffect(() => {
    browser.runtime.sendMessage({ action }, response => {
      set({ loading: false, value: response });
    });
  }, [action]);
  return state;
};

export default useBackground;

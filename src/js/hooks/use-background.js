import { useEffect, useState } from 'react';

const useBackground = action => {
  const [state, set] = useState({ loading: true, value: null });
  useEffect(() => {
    chrome.runtime.sendMessage({ action }, response => {
      set({ loading: false, value: response });
    });
  }, [action]);
  return state;
};

export default useBackground;

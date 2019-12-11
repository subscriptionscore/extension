import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';

import useStorage from '../hooks/use-storage';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [, setStorage] = useStorage();

  const value = useMemo(() => [state, dispatch], [state, dispatch]);

  useEffect(() => {
    getUser()
      .then(data => {
        dispatch({ type: 'load', data });
      })
      .catch(() => {
        console.error('no loady');
      });
  }, []);

  // set the chrome storage
  useEffect(() => {
    if (!state.loading) {
      setStorage(state.settings);
    }
  }, [setStorage, state.loading, state.settings]);

  const content = useMemo(() => (state.loading ? null : children), [
    children,
    state.loading
  ]);
  return <UserContext.Provider value={value}>{content}</UserContext.Provider>;
};

export const initialState = {
  settings: {
    darkMode: false,
    colorSet: 'normal'
  },
  loading: true
};

const reducer = (state = initialState, action) => {
  const { data, type } = action;

  switch (type) {
    case 'load': {
      const user = data;
      return {
        ...state,
        ...user,
        loading: false
      };
    }
    case 'save-setting': {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.data
        }
      };
    }
    case 'set-license-key': {
      return {
        ...state,
        licenseKey: action.data
      };
    }
    default:
      return state;
  }
};

function getUser() {
  return new Promise(resolve => resolve(initialState));
}

export const useUser = () => useContext(UserContext);

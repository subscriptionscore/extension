import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [state, dispatch], [state, dispatch]);

  useEffect(() => {
    // todo temporary
    const user = localStorage.getItem('user');
    dispatch({ type: 'load', data: user });
  }, []);

  const content = useMemo(() => (state.loading ? null : children), [
    children,
    state.loading
  ]);
  return <UserContext.Provider value={value}>{content}</UserContext.Provider>;
};

const initialState = {
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
    default:
      return state;
  }
};

export const useUser = () => useContext(UserContext);

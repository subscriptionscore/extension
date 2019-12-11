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
    const user = get();
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
      const newState = {
        ...state,
        settings: {
          ...state.settings,
          ...action.data
        }
      };
      set(newState);
      return newState;
    }
    case 'set-license-key': {
      const newState = {
        ...state,
        licenseKey: action.data
      };
      set(newState);
      return newState;
    }
    default:
      return state;
  }
};

function set(user) {
  localStorage.setItem('user', JSON.stringify(user));
}
function get() {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return {};
}

export const useUser = () => useContext(UserContext);

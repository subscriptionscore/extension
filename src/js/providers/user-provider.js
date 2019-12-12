import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';

import { graphqlRequest } from '../utils/request';
import useStorage from '../hooks/use-storage';

const UserContext = createContext(null);

const initialState = {
  user: {
    preferences: {
      darkMode: false,
      colorSet: 'normal'
    }
  },
  licenceKey: '',
  loading: false,
  initialised: false,
  loaded: false
};

export const UserProvider = ({ children }) => {
  const [
    { value: initialPreferences, loading: prefsLoading },
    setStorage
  ] = useStorage();

  const [state, dispatch] = useReducer(reducer, initialState);

  // initialise the preferences
  useEffect(() => {
    if (!prefsLoading && !state.initialised) {
      let data = initialState;
      if (initialPreferences) {
        data = {
          ...data,
          user: {
            preferences: initialPreferences
          }
        };
      }
      console.log('prefs loaded not yet init');
      dispatch({
        type: 'init',
        data
      });
    }
  }, [initialPreferences, prefsLoading, state]);

  // load the user on licence key entered
  useEffect(() => {
    if (state.licenceKey && !state.loaded) {
      onSubmitLicenceKey(state.licenceKey);
    }
  }, [onSubmitLicenceKey, state.licenceKey, state.loaded]);

  // set the chrome storage on preferences changed
  useEffect(() => {
    if (state.initialised) {
      setStorage(state.user.preferences);
    }
  }, [setStorage, state.initialised, state.user.preferences]);

  // save the user on preferences changed
  useEffect(() => {
    if (state.loaded) {
      console.log('saving user prefs', state.user.preferences);
    }
  }, [state.loaded, state.user.preferences]);

  const value = useMemo(() => [state, dispatch], [state, dispatch]);

  const onSubmitLicenceKey = useCallback(
    async licenceKey => {
      try {
        dispatch({ type: 'reset' });
        const user = await getUser(licenceKey);
        if (!user) {
          throw new Error('invalid licence key');
        }
        const mappedUser = mapUser(user, state);
        console.log('loading user', mappedUser);
        dispatch({ type: 'load', data: mappedUser });
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'error',
          data: `That licence key is invalid, please try again or contact support.`
        });
      }
    },
    [state]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const reducer = (state = initialState, action) => {
  const { data, type } = action;

  switch (type) {
    case 'init': {
      return {
        ...state,
        ...data,
        initialised: true
      };
    }
    case 'load': {
      const user = data;
      return {
        ...state,
        user,
        loading: false,
        error: false,
        loaded: true
      };
    }
    case 'error': {
      return {
        ...state,
        loading: false,
        error: action.data
      };
    }
    case 'reset': {
      return {
        ...state,
        loading: false,
        error: false
      };
    }
    case 'save-setting': {
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...action.data
          }
        }
      };
    }
    case 'set-licence-key': {
      return {
        ...state,
        licenceKey: action.data
      };
    }
    default:
      return state;
  }
};

const gql = `
query User($licenceKey: ID!) {
  getUserByLicenceKey(licenceKey: $licenceKey) {
    email
    licenceKey
    preferences {
      darkMode
      colorSet
    }
  }
}
`;

async function getUser(licenceKey) {
  const options = { variables: { licenceKey } };
  const { getUserByLicenceKey } = await graphqlRequest(gql, options);
  return getUserByLicenceKey;
}

function mapUser(user, state) {
  const preferences = Object.keys(user.preferences).reduce((out, key) => {
    const pref = user.preferences[key];
    if (pref !== null) {
      return {
        ...out,
        [key]: pref
      };
    }
    return out;
  }, state.user.preferences);

  return {
    ...user,
    preferences
  };
}

export const useUser = () => useContext(UserContext);

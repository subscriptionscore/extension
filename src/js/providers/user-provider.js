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
    { value: storage = {}, loading: storageLoading },
    setStorage
  ] = useStorage();

  const [state, dispatch] = useReducer(reducer, initialState);

  // initialise the user from storage
  useEffect(() => {
    if (!storageLoading && !state.initialised) {
      const { preferences, licenceKey } = storage;
      let data = initialState;

      if (licenceKey) {
        // restore the existing user
        data = {
          ...data,
          licenceKey
        };
      }
      if (preferences) {
        // restore the preferences if there are any
        data = {
          ...data,
          user: {
            preferences
          }
        };
      }
      dispatch({
        type: 'init',
        data
      });
    }
  }, [storageLoading, state, storage]);

  // load the user on licence key entered
  useEffect(() => {
    if (state.licenceKey && !state.loaded) {
      onSubmitLicenceKey(state.licenceKey);
    }
  }, [onSubmitLicenceKey, state.licenceKey, state.loaded]);

  // set the chrome storage on preferences changed
  useEffect(() => {
    if (state.initialised) {
      setStorage({
        preferences: state.user.preferences,
        licenceKey: state.user.licenceKey
      });
    }
  }, [setStorage, state.initialised, state.user]);

  // save the user on preferences changed
  useEffect(() => {
    if (state.loaded) {
      const { licenceKey, preferences } = state.user;
      updateUser(licenceKey, preferences)
        .then(prefs => {
          console.log('[user]: saved prefs', prefs);
        })
        .catch(err => {
          console.error('failed to save prefs.. what do?', err);
        });
    }
  }, [state.loaded, state.user, state.user.preferences]);

  const value = useMemo(() => [state, dispatch], [state, dispatch]);

  const onSubmitLicenceKey = useCallback(
    async licenceKey => {
      try {
        dispatch({ type: 'reset' });
        dispatch({ type: 'loading', data: true });
        const user = await getUser(licenceKey);
        if (!user) {
          throw new Error('invalid-key');
        }
        const mappedUser = mapUser(user, state);
        dispatch({ type: 'load', data: mappedUser });
      } catch (err) {
        console.error('failed to submit licence key...');
        console.error(err);
        const message = getError(err);
        dispatch({
          type: 'error',
          data: message
        });
      } finally {
        dispatch({ type: 'loading', data: false });
      }
    },
    [state]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

function getError(err) {
  const defaultMsg = `Something went wrong saving your licence key, please try again or contact support.`;
  if (err && err.message) {
    switch (err.message) {
      case 'invalid-key':
        return `That licence key is invalid, please try again or contact support.`;
      default:
        return defaultMsg;
    }
  }
  return defaultMsg;
}

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
        error: action.data
      };
    }
    case 'loading': {
      return {
        ...state,
        loading: action.data
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

const getGql = `
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
  const { getUserByLicenceKey } = await graphqlRequest(getGql, options);
  return getUserByLicenceKey;
}

const updateGql = `
mutation User($licenceKey: ID!, $preferences: Preferences!) {
  updateUserPreferences(licenceKey: $licenceKey, preferences: $preferences) {
    preferences {
      darkMode
      colorSet
    }
  }
}
`;
async function updateUser(licenceKey, preferences) {
  const options = { variables: { licenceKey, preferences } };
  const { updateUserPreferences } = await graphqlRequest(updateGql, options);
  return updateUserPreferences;
}

function mapUser(user, state) {
  let preferences;
  if (!user.preferences) {
    preferences = state.user.preferences;
  } else {
    preferences = Object.keys(user.preferences).reduce((out, key) => {
      const pref = user.preferences[key];
      if (pref !== null) {
        return {
          ...out,
          [key]: pref
        };
      }
      return out;
    }, state.user.preferences);
  }

  return {
    ...user,
    preferences
  };
}

export const useUser = () => useContext(UserContext);

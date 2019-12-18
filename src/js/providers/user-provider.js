import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';

import { graphqlRequest } from '../utils/request';
import { updateUserPreferences } from '../utils/preferences';
import useStorage from '../hooks/use-storage';

const UserContext = createContext({});

const initialState = {
  user: {
    preferences: {
      darkMode: false,
      colorSet: 'normal',
      alertOnSubmit: true,
      ignoredEmailAddresses: [],
      ignoredSites: [],
      blockedRank: ''
    }
  },
  licenceKey: '',
  loading: false,
  initialised: false,
  loaded: false,
  error: null,
  success: null
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
    case 'set-error': {
      return {
        ...state,
        error: action.data
      };
    }
    case 'set-success': {
      return {
        ...state,
        success: action.data
      };
    }
    case 'set-loading': {
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
    case 'save-preference': {
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
    case 'add-ignored-email-address': {
      const existingList = state.user.preferences.ignoredEmailAddresses;
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ignoredEmailAddresses: [
              ...existingList.filter(e => e !== action.data),
              action.data
            ]
          }
        }
      };
    }
    case 'remove-ignored-email-address': {
      const email = action.data;
      const existingList = state.user.preferences.ignoredEmailAddresses;
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ignoredEmailAddresses: existingList.filter(d => d !== email)
          }
        }
      };
    }
    case 'add-ignored-site': {
      const existingList = state.user.preferences.ignoredSites;
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ignoredSites: [
              ...existingList.filter(e => e !== action.data),
              action.data
            ]
          }
        }
      };
    }
    case 'remove-ignored-site': {
      const email = action.data;
      const existingList = state.user.preferences.ignoredSites;
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ignoredSites: existingList.filter(d => d !== email)
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

const UserProvider = ({ children }) => {
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
      // save the user preferences
      if (state.user.licenceKey) {
        setStorage({
          preferences: state.user.preferences,
          licenceKey: state.user.licenceKey
        });
      } else {
        setStorage({ preferences: state.user.preferences });
      }
    }
  }, [setStorage, state.initialised, state.user]);

  // save the user on preferences changed
  useEffect(() => {
    if (state.loaded) {
      onUserChange(state.user);
    }
  }, [state.loaded, state.user, state.user.preferences]);

  const value = useMemo(() => [state, dispatch], [state, dispatch]);

  const onSubmitLicenceKey = useCallback(
    async licenceKey => {
      try {
        dispatch({ type: 'reset' });
        dispatch({ type: 'set-loading', data: true });
        const user = await getUser(licenceKey);
        if (!user) {
          throw new Error('invalid-key');
        }
        const mappedUser = mapUser(user, state);
        dispatch({ type: 'load', data: mappedUser });
      } catch (err) {
        const message = getError(err, state);
        dispatch({
          type: 'set-error',
          data: message
        });
      } finally {
        dispatch({ type: 'set-loading', data: false });
      }
    },
    [state]
  );

  async function onUserChange(user) {
    try {
      dispatch({ type: 'set-loading', data: true });
      const { preferences } = user;
      await updateUserPreferences(preferences);
    } catch (err) {
      dispatch({
        type: 'set-error',
        data: `Failed to save user, please try again or contact support`
      });
    } finally {
      dispatch({ type: 'set-loading', data: false });
    }
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

function getError(err, state) {
  const defaultMsg = `Something went wrong, please try again or contact support.`;

  // we have fetched the licence key but the user is null
  if (err && err.message && err.message === 'invalid-key') {
    return `That licence key is invalid, please try again or contact support.`;
  }
  // there is a licence key to restore but the user has failed to load
  if (state.licenceKey && !state.loaded) {
    return `Something went wrong loading your data, please try again or contact support.`;
  }

  return defaultMsg;
}

const getGql = `
query User($licenceKey: ID!) {
  getUserByLicenceKey(licenceKey: $licenceKey) {
    email
    licenceKey
    preferences {
      darkMode
      colorSet
      alertOnSubmit
      ignoredEmailAddresses
      ignoredSites
      blockedRank
    }
  }
}
`;

async function getUser(licenceKey) {
  const options = { variables: { licenceKey } };
  const { getUserByLicenceKey } = await graphqlRequest(getGql, options);
  return getUserByLicenceKey;
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

export default UserProvider;

export const useUser = () => useContext(UserContext);

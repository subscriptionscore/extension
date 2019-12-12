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

const gql = `
query User($licenceKey: String!) {
  getUserByLicenceKey(licenceKey: $licenceKey) {
    id
    email
    licenceKey
    preferences
  }
}
`;

const initialState = {
  preferences: {
    darkMode: false,
    colorSet: 'normal'
  },
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
      // console.log('has chrome prefs', initialPreferences);
      let data = initialState;
      if (initialPreferences) {
        data = { ...data, preferences: initialPreferences };
      }
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
      setStorage(state.preferences);
    }
  }, [setStorage, state.initialised, state.preferences]);

  // save the user on preferences changed
  useEffect(() => {
    if (state.loaded) {
      console.log('saving user prefss', state.preferences);
    }
  }, [state.loaded, state.preferences]);

  const value = useMemo(() => [state, dispatch], [state, dispatch]);

  const onSubmitLicenceKey = useCallback(
    async licenceKey => {
      try {
        let user = await getUser(licenceKey);
        // if user doesn't have any prefs then use the ones from Chrome
        if (!user.preferences) {
          user = {
            ...user,
            preferences: state.preferences
          };
        }
        console.log('loading user', user);
        dispatch({ type: 'load', data: user });
      } catch (err) {
        console.error('no loady, what do?');
        console.error(err);
      }
    },
    [state.preferences]
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
        ...user,
        loaded: true
      };
    }
    case 'save-setting': {
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.data
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

function getUser(licenceKey) {
  return new Promise(resolve =>
    resolve({
      id: '1234',
      email: 'danielle@squarecat.io',
      licenseKey: licenceKey
    })
  );
  // return graphqlRequest(gql, { licenceKey });
}

export const useUser = () => useContext(UserContext);

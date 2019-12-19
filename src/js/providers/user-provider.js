import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useReducer
} from 'react';

import userReducer, { initialState } from './user-reducer';
import { graphqlRequest } from '../utils/request';
import { updateUserPreferences } from '../utils/preferences';
import useStorage from '../hooks/use-storage';

const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [storage, setStorage] = useStorage();
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [licenceKey, setLicenceKey] = useState();

  debugger;

  // if the licence key changes then store it locally in
  // browser storage and fetch the user associated with
  // it from the remote db
  useEffect(() => {
    dispatch({ type: 'reset' });
    getUser(licenceKey)
      .then(user => {
        if (!user) {
          throw new Error('invalid-key');
        }
        if (licenceKey !== storage.licenceKey) {
          setStorage({ licenceKey });
        }
        dispatch({ type: 'load', data: user });
      })
      .catch(err => {
        dispatch({
          type: 'set-error',
          data: err
        });
      });
  }, [licenceKey, setStorage, storage.licenceKey]);

  // when storage loads, if there is a user in there then
  // load it into memory, otherwise fetch the user from
  // the remote database
  useEffect(() => {
    if (!storage.loading) {
      const { value } = storage;
      if (value.preferences && !state.initialized) {
        dispatch({ type: 'initialize', data: value });
      }
      if (value.licenceKey && value.licenceKey !== licenceKey) {
        setLicenceKey(value.licenceKey);
      }
    }
  }, [licenceKey, state.initialized, storage]);

  // if the preferences change then send them to the remote db
  // and store them locally in browser storage
  useEffect(() => {
    if (state.initialized && state.user.preferences) {
      updateUserPreferences(state.user.preferences);
      setStorage({ preferences: state.user.preferences });
    }
  }, [state.initialized, state.user.preferences, setStorage]);

  const setSuccess = useCallback(data => {
    dispatch({
      type: 'set-success',
      data
    });
  }, []);

  const clearFeedback = useCallback(() => {
    if (state.success) {
      dispatch({ type: 'set-success', data: null });
    }
    if (state.error) {
      dispatch({ type: 'set-error', data: null });
    }
  }, [state.error, state.success]);

  const setPreference = useCallback(data => {
    dispatch({ type: 'save-preference', data });
  }, []);

  const value = useMemo(
    () => [state, { setLicenceKey, setSuccess, setPreference, clearFeedback }],
    [state, setLicenceKey, setSuccess, setPreference, clearFeedback]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

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

export default UserProvider;

export const useUser = () => useContext(UserContext);

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react';
import userReducer, { initialState } from './user-reducer';

import { graphqlRequest } from '../utils/request';
import { updateUserPreferences } from '../utils/preferences';
import useStorage from '../hooks/use-storage';

const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [storage, setStorage] = useStorage();
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [licenceKey, setLicenceKey] = useState(null);

  // wait for load of data from storage
  useEffect(() => {
    if (!storage.loading) {
      const { value } = storage;
      if (!state.initialized) {
        dispatch({ type: 'initialize', data: value });
      }
      if (value.licenceKey && value.licenceKey !== licenceKey) {
        setLicenceKey(value.licenceKey);
      }
    }
  }, [licenceKey, state.initialized, storage]);

  // if the licence key changes then store it locally in
  // browser storage and fetch the user associated with
  // it from the remote db
  useEffect(() => {
    if (licenceKey) {
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
    } else if (state.initialized) {
      dispatch({ type: 'load' });
    }
  }, [licenceKey, setStorage, state.initialized, storage.licenceKey]);

  const updateStores = useCallback(async () => {
    await updateUserPreferences(state.user.preferences);
    await setStorage({ preferences: state.user.preferences });
  }, [setStorage, state.user.preferences]);

  useEffect(() => {
    if (state.user.dirty) {
      dispatch({ type: 'set-synced' });
      updateStores();
    }
  }, [state.user.dirty, updateStores]);

  const changeEmailIgnoreList = useCallback((action, email) => {
    if (action === 'add') {
      dispatch({ type: 'add-ignored-email-address', data: email });
    } else {
      dispatch({ type: 'remove-ignored-email-address', data: email });
    }
  }, []);
  const changeSiteIgnoreList = useCallback((action, site) => {
    if (action === 'add') {
      dispatch({ type: 'add-ignored-site', data: site });
    } else {
      dispatch({ type: 'remove-ignored-site', data: site });
    }
  }, []);
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
    () => [
      state,
      {
        setLicenceKey,
        setSuccess,
        setPreference,
        clearFeedback,
        changeEmailIgnoreList,
        changeSiteIgnoreList
      }
    ],
    [
      state,
      setLicenceKey,
      setSuccess,
      setPreference,
      clearFeedback,
      changeEmailIgnoreList,
      changeSiteIgnoreList
    ]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const getGql = `
query User($licenceKey: ID!) {
  getUserByLicenceKey(licenceKey: $licenceKey) {
    email
    licenceKey
    planId
    preferences {
      darkMode
      colorSet
      alertOnSubmit
      ignoredEmailAddresses
      ignoredSites
      blockedRank
    }
    features
    emails {
      forwardingAddress
      enabled
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

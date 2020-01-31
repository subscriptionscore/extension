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
      if (!value || !value.preferences) {
        // if store is totally empty then the ext has just
        // been installed so we should populate it
        dispatch({ type: 'save-preference', data: {} });
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
  const changeSiteIgnoreList = useCallback(async (action, site) => {
    if (action === 'add') {
      const { success, domain } = await addIgnoredSiteStat(site, 'add');
      if (success) {
        dispatch({ type: 'add-ignored-site', data: domain });
      } else {
        dispatch({ type: 'set-error', data: { message: 'invalid-site' } });
      }
    } else {
      dispatch({ type: 'remove-ignored-site', data: site });
      addIgnoredSiteStat(site, 'remove');
    }
  }, []);
  const setSuccess = useCallback(data => {
    dispatch({
      type: 'set-success',
      data
    });
  }, []);
  const setError = useCallback(data => {
    dispatch({
      type: 'set-error',
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

  const createEmail = useCallback(
    async ({ email, forwardingAddress }) => {
      let response;
      try {
        response = await createEmailForUser({
          email,
          forwardingAddress,
          licenceKey
        });
        if (response.email) {
          dispatch({
            type: 'add-email',
            data: { email, forwardingAddress, enabled: true }
          });
        }
      } catch (err) {
        return {
          error: err,
          value: null
        };
      }
      return { value: response };
    },
    [licenceKey]
  );
  const setEmailStatus = useCallback(
    async (email, status) => {
      let response;
      // update now so UI updates
      dispatch({
        type: 'update-email-status',
        data: { email, enabled: status }
      });
      try {
        response = await setEmailStatusForUser({
          email,
          enabled: status,
          licenceKey
        });
      } catch (err) {
        // rollback
        dispatch({
          type: 'update-email-status',
          data: { email, enabled: !status }
        });
        return {
          error: err,
          value: null
        };
      }
      return { value: response };
    },
    [licenceKey]
  );
  const updateEmail = useCallback((email, forwardingAddress) => {}, []);
  const deleteEmail = useCallback(
    async email => {
      let response;
      try {
        response = await deleteEmailForUser({
          email,
          licenceKey
        });
        dispatch({
          type: 'remove-email',
          data: email
        });
      } catch (err) {
        console.error(err);
        return {
          error: err,
          value: null
        };
      }
      return { value: response };
    },
    [licenceKey]
  );
  const value = useMemo(
    () => [
      state,
      {
        setLicenceKey,
        setSuccess,
        setError,
        setPreference,
        clearFeedback,
        changeEmailIgnoreList,
        changeSiteIgnoreList,
        createEmail,
        updateEmail,
        deleteEmail,
        setEmailStatus
      }
    ],
    [
      state,
      setLicenceKey,
      setSuccess,
      setError,
      setPreference,
      clearFeedback,
      changeEmailIgnoreList,
      changeSiteIgnoreList,
      createEmail,
      updateEmail,
      deleteEmail,
      setEmailStatus
    ]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const getGql = `
query User($licenceKey: ID!) {
  getUserByLicenceKey(licenceKey: $licenceKey) {
    email
    licenceKey
    planName
    preferences {
      darkMode
      colorSet
      alertOnSubmit
      ignoredEmailAddresses
      ignoredSites
      blockedRank
      autoAllow
      autoAllowTimeout
    }
    features
    referralCode
  }
}
`;

async function getUser(licenceKey) {
  const options = { variables: { licenceKey } };
  const { getUserByLicenceKey } = await graphqlRequest(getGql, options);
  return getUserByLicenceKey;
}

const createEmailGql = `
mutation CreateEmail($email: String!, $forwardingAddress: String!) {
  createEmail(email: $email, forwardingAddress: $forwardingAddress) {
    email
  }
}
`;
async function createEmailForUser({ email, forwardingAddress, licenceKey }) {
  const options = { variables: { licenceKey, email, forwardingAddress } };
  const { createEmail } = await graphqlRequest(createEmailGql, options);
  return createEmail;
}

const deleteEmailGql = `
mutation DeleteEmail($email: String!) {
  deleteEmail(email: $email) {
    success
  }
}
`;
async function deleteEmailForUser({ email, licenceKey }) {
  const options = { variables: { licenceKey, email } };
  const { deleteEmail } = await graphqlRequest(deleteEmailGql, options);
  return deleteEmail;
}

const setStatusGql = `
mutation SetStatusEmail($email: String!, $enabled: Boolean!) {
  setEmailStatus(email: $email, enabled: $enabled) {
    success
  }
}
`;
async function setEmailStatusForUser({ email, enabled, licenceKey }) {
  const options = { variables: { licenceKey, email, enabled } };
  const { deleteEmail } = await graphqlRequest(setStatusGql, options);
  return deleteEmail;
}

const addIgnoredSiteStatGql = `
mutation ($domain: String!, $action: String!) {
  addIgnoredSiteStat(domain: $domain, action: $action) {
    success
    domain
  }
}
`;
async function addIgnoredSiteStat(site, action) {
  let domain = site;
  if (/^http(s)?/.test(site)) {
    domain = new URL(site).hostname;
  }
  const options = { variables: { domain, action } };
  const { addIgnoredSiteStat } = await graphqlRequest(
    addIgnoredSiteStatGql,
    options
  );
  return addIgnoredSiteStat;
}

export default UserProvider;

export const useUser = () => useContext(UserContext);

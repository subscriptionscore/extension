export const initialState = {
  user: {
    features: [],
    emails: [],
    preferences: {
      darkMode: false,
      colorSet: 'normal',
      alertOnSubmit: false,
      ignoredEmailAddresses: [],
      ignoredSites: [],
      blockedRank: 'A',
      autoAllow: true,
      autoAllowTimeout: 10,
      gmailEnabled: false
    }
  },
  licenceKey: '',
  loading: false,
  initialized: false,
  loaded: false,
  error: null,
  success: null
};

export default (state = initialState, action) => {
  const { data, type } = action;
  switch (type) {
    case 'initialize': {
      return {
        ...state,
        ...data,
        initialized: true
      };
    }
    case 'load': {
      const user = data;
      return {
        ...state,
        user: user || initialState.user,
        loading: false,
        error: false,
        loaded: true
      };
    }
    case 'set-synced': {
      return {
        ...state,
        user: {
          ...state.user,
          dirty: false
        }
      };
    }
    case 'set-error': {
      const message = getError(action.data, state);
      return {
        ...state,
        error: message,
        success: null,
        loading: false
      };
    }
    case 'set-success': {
      return {
        ...state,
        success: action.data,
        error: null,
        loading: false
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
          dirty: true,
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
          dirty: true,
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
          dirty: true,
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
          dirty: true,
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
          dirty: true,
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
    case 'add-email': {
      return {
        ...state,
        user: {
          ...state.user,
          emails: [...(state.user.emails || []), action.data]
        }
      };
    }
    case 'remove-email': {
      return {
        ...state,
        user: {
          ...state.user,
          emails: state.user.emails.filter(e => e.email !== action.data)
        }
      };
    }
    case 'update-email-status': {
      return {
        ...state,
        user: {
          ...state.user,
          emails: state.user.emails.map(e =>
            e.email !== action.data.email
              ? e
              : { ...e, enabled: action.data.enabled }
          )
        }
      };
    }
    default:
      return state;
  }
};

function getError(err, state) {
  if (!err) return null;

  const defaultMsg = `Something went wrong, please try again or contact support.`;

  // we have fetched the licence key but the user is null
  if (err && err.message) {
    if (err.message === 'invalid-key') {
      return `That licence key is invalid, please try again or contact support.`;
    }
    if (err.message === 'invalid-site') {
      return `That website is not valid, please try again or contact support.`;
    }
  }
  // there is a licence key to restore but the user has failed to load
  if (state.licenceKey && !state.loaded) {
    return `Something went wrong loading your data, please try again or contact support.`;
  }

  return defaultMsg;
}

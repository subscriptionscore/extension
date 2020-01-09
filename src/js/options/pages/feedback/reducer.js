export const initialState = {
  feedback: {
    domain: '',
    isOwner: false,
    ownerEmail: '',
    scoreInaccurateReason: '',
    otherDetails: ''
  },
  loading: false,
  error: false,
  submitted: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set-is-owner':
      return {
        ...state,
        feedback: {
          ...state.feedback,
          isOwner: action.data
        }
      };
    case 'set-owner-email':
      return {
        ...state,
        feedback: {
          ...state.feedback,
          ownerEmail: action.data
        }
      };
    case 'set-domain':
      return {
        ...state,
        feedback: {
          ...state.feedback,
          domain: action.data
        }
      };
    case 'set-score-inaccurate-reason':
      return {
        ...state,
        feedback: {
          ...state.feedback,
          scoreInaccurateReason: action.data
        }
      };
    case 'set-other-details':
      return {
        ...state,
        feedback: {
          ...state.feedback,
          otherDetails: action.data
        }
      };
    case 'set-loading': {
      return {
        ...state,
        loading: action.data,
        error: false
      };
    }
    case 'set-error': {
      return {
        ...state,
        error: action.data,
        loading: false
      };
    }
    case 'set-submitted': {
      return {
        ...state,
        submitted: action.data,
        loading: false,
        error: false,
        feedback: initialState.feedback
      };
    }
    case 'reset': {
      return {
        ...state,
        ...initialState
      };
    }
  }
};

export default reducer;

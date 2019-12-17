export const initialState = {
  feedback: {
    domain: '',
    isOwner: false,
    ownerEmail: '',
    isScoreInaccurate: false,
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
    case 'set-is-score-inaccurate':
      return {
        ...state,
        feedback: {
          ...state.feedback,
          isScoreInaccurate: action.data
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
    case 'reset': {
      return {
        ...state,
        feedback: initialState.feedback
      };
    }
    case 'set-loading': {
      return {
        ...state,
        loading: action.data
      };
    }
    case 'set-error': {
      return {
        ...state,
        error: action.data
      };
    }
    case 'set-submitted': {
      return {
        ...state,
        submitted: action.data
      };
    }
  }
};

export default reducer;

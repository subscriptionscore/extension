export const initialState = {
  page: 'appearance',
  settings: {
    colorSet: 'normal',
    darkMode: false
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'set-page': {
      return {
        ...state,
        page: action.data
      };
    }
    case 'save-setting': {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.data
        }
      };
    }
    default:
      return state;
  }
};

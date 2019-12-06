export const initialState = {
  page: 'appearance'
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'set-page': {
      return {
        ...state,
        page: action.data
      };
    }
    default:
      return state;
  }
};

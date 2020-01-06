import {
  ADD_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  GET_COMMENTS
} from "./commentTypes";

const initialState = {
  comments: {},
  isPending: false,
  isReady: false,
  erro: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.commentsId]: state.comments[action.payload.commentsId]
            ? [...comments[action.payload.commentsId], action.payload]
            : [action.payload]
        }
      };
    case GET_COMMENTS:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.commentsId]: action.payload.comments
        }
      };
    default:
      return state;
  }
};

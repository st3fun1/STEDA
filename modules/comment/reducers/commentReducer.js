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
  error: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.photoId]: state.comments[action.payload.photoId]
            ? [
                ...state.comments[action.payload.photoId],
                action.payload.comment
              ]
            : [action.payload.comment]
        }
      };
    case GET_COMMENTS:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.photoId]: action.payload.data
        }
      };
    default:
      return state;
  }
};

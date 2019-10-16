import { GET_USER, GET_USERS_LIST } from "./userTypes";

const initialState = {
  currentUser: null,
  token: null,
  users: [],
  isPending: false,
  isReady: false,
  error: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        currentUser: action.payload
      };
    case GET_USERS_LIST:
      return {
        ...state,
        users: [...action.payload]
      };
    default:
      return state;
  }
};

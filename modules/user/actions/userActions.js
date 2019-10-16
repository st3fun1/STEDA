import axios from "axios";
import { GET_USERS_LIST, GET_USER } from "../reducers/userTypes";

const getUserList = () => dispatch => {
  axios.get("/api/user-list").then(response => {
    console.log("response", response);
    dispatch({
      type: GET_USERS_LIST,
      payload: response.data.users
    });
  });
};

const getUserById = id => dispatch => {
  axios.get(`/api/user/${id}`).then(response => {
    console.log("response", response);
    dispatch({
      type: GET_USER,
      payload: response.data.user
    });
  });
};

export { getUserList, getUserById };

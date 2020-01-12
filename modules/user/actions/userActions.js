import axios from "axios";
import cookie from "react-cookies";
import { GET_USERS_LIST, GET_USER } from "../reducers/userTypes";
import Router from "next/router";

const getUserList = () => dispatch => {
  axios.get("/api/user-list").then(response => {
    dispatch({
      type: GET_USERS_LIST,
      payload: response.data.users
    });
  });
};

const getUserById = id => dispatch => {
  console.log("id: ", id);
  axios.get(`/api/user/${id}`).then(response => {
    dispatch({
      type: GET_USER,
      payload: response.data.user
    });
  });
};

const signUp = data => dispatch => {
  console.log("data", data);
  axios
    .post("/auth/signup", data)
    .then(response => {
      dispatch({
        type: GET_USER,
        payload: response.data.user
      });
      //Save current URL so user is redirected back here after signing in
      cookie.save("redirect_url", window.location.pathname, { path: "/" });
      Router.push("/");
    })
    .catch(err => {
      console.log("err", err);
    });
};

export { getUserList, getUserById, signUp };

import axios from "axios";

import { ADD_COMMENT } from "../reducers/commentTypes";

const addComment = data => dispatch => {
  console.log("COMMENT DATA", data);
  axios
    .post("/api/comment", data)
    .then(response => {
      dispatch({
        type: ADD_COMMENT,
        payload: response.data
      });
    })
    .catch(err => {
      console.log("err", err);
    });
};

export { addComment };

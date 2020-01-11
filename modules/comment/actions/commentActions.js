import axios from "axios";

import { ADD_COMMENT, GET_COMMENTS } from "../reducers/commentTypes";

const addComment = data => dispatch => {
  console.log("COMMENT DATA", data);
  axios
    .post("/api/comment", data)
    .then(response => {
      console.log("te", response);
      dispatch({
        type: ADD_COMMENT,
        payload: {
          photoId: response.data.photoId,
          comment: response.data
        }
      });
    })
    .catch(err => {
      console.log("err", err);
    });
};

const getComments = photoId => dispatch => {
  console.log("PHOTO ID", photoId);
  axios
    .get(`/api/commentsByPhotoId/${photoId}`)
    .then(response => {
      console.log("response", response);
      dispatch({
        type: GET_COMMENTS,
        payload: response.data
      });
    })
    .catch(err => {
      console.log("err", err);
    });
};

export { addComment, getComments };

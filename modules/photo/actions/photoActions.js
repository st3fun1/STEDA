import axios from "axios";
import {
  GET_PHOTOS,
  GET_PHOTO_BY_ID,
  UPLOAD_PHOTO,
  DELETE_PHOTO,
  GET_PHOTOS_BY_USER_ID,
  UPDATE_LIKE_STATUS
} from "../reducers/photoTypes";

const getPhotoList = () => dispatch => {
  axios.get("/api/photo/list").then(response => {
    dispatch({
      type: GET_PHOTOS,
      payload: response.data
    });
  });
};

const getPhotosByUserId = userId => dispatch => {
  axios.get(`/api/photo/byUserId/${userId}`).then(response => {
    dispatch({
      type: GET_PHOTOS_BY_USER_ID,
      payload: response.data
    });
  });
};

const getPhotoById = photoId => dispatch => {
  axios
    .get(`/api/photo/${photoId}`)
    .then(response => {
      dispatch({
        type: GET_PHOTO_BY_ID,
        payload: response.data
      });
    })
    .catch(error => {
      console.log("photo by id error", error);
    });
};

const deletePhotoById = photoID => dispatch => {
  axios
    .get(`/api/photo/${photoId}/delete`)
    .then(() => {
      dispatch({
        type: DELETE_PHOTO,
        payload: photoID
      });
    })
    .catch(error => {
      console.log("delete photo error", error);
    });
};

const likeById = data => dispatch => {
  if (!data.liked) {
    axios
      .post("/api/photo/like", data)
      .then(() => {
        dispatch({
          type: UPDATE_LIKE_STATUS,
          payload: true
        });
      })
      .catch(error => {
        console.log("Like error \n", error);
      });
  } else {
    axios
      .delete("/api/photo/like", {
        data
      })
      .then(() => {
        dispatch({
          type: UPDATE_LIKE_STATUS,
          payload: false
        });
      })
      .catch(error => {
        console.log("Dislike error \n", error);
      });
  }
};
export {
  getPhotoList,
  getPhotosByUserId,
  getPhotoById,
  deletePhotoById,
  likeById
};

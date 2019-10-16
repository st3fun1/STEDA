import axios from "axios";
import {
  GET_PHOTOS,
  GET_PHOTO_BY_ID,
  UPLOAD_PHOTO,
  GET_PHOTOS_BY_USER_ID
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
  axios.get(`/api/photo/${photoId}`).then(response => {
    console.log("photo", photo);
    dispatch({
      type: GET_PHOTOS_BY_USER_ID,
      payload: response.data
    });
  });
};

export { getPhotoList, getPhotosByUserId, getPhotoById };

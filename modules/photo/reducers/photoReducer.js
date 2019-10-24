import {
  GET_PHOTOS,
  GET_PHOTO_BY_ID,
  UPLOAD_PHOTO,
  GET_PHOTOS_BY_USER_ID
} from "./photoTypes";

const initialState = {
  photos: [],
  photosByUserId: [],
  photoById: null,
  isPending: false,
  isReady: false,
  error: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PHOTOS:
      return {
        ...state,
        photos: action.payload
      };
    case GET_PHOTO_BY_ID:
      return {
        ...state,
        photoById: action.payload
      };
    case UPLOAD_PHOTO:
      return {
        ...state,
        photos: [...state.photos, action.payload]
      };
    case GET_PHOTOS_BY_USER_ID:
      return {
        ...state,
        photosByUserId: action.payload
      };
    default:
      return state;
  }
};

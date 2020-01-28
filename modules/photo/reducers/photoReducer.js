import {
  GET_PHOTOS,
  GET_PHOTO_BY_ID,
  UPLOAD_PHOTO,
  GET_PHOTOS_BY_USER_ID,
  UPDATE_LIKE_STATUS,
  GET_LIKED_PHOTOS
} from "./photoTypes";

const initialState = {
  photos: [],
  photosByUserId: [],
  photoById: null,
  isPending: false,
  isReady: false,
  photosAreReady: false,
  photosArePending: false,
  photosError: false,
  error: false,
  likedPhotos: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PHOTOS:
      return {
        ...state,
        photos: action.payload,
        photosAreReady: true
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
    case UPDATE_LIKE_STATUS:
      return {
        ...state,
        photoById: {
          ...state.photoById,
          liked: action.payload
        }
      };
    case GET_PHOTOS_BY_USER_ID:
      return {
        ...state,
        photosByUserId: action.payload
      };
    case GET_LIKED_PHOTOS:
      return {
        ...state,
        likedPhotos: action.payload
      };
    default:
      return state;
  }
};

import { combineReducers } from "redux";
import userReducer from "modules/user/reducers/userReducer";
import photoReducer from "modules/photo/reducers/photoReducer";
import commentReducer from "../modules/comment/reducers/commentReducer";

const rootReducer = combineReducers({
  user: userReducer,
  photo: photoReducer,
  comment: commentReducer
});

export default rootReducer;

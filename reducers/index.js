import { combineReducers } from "redux";
import userReducer from "modules/user/reducers/userReducer";
import photoReducer from "modules/photo/reducers/photoReducer";

const rootReducer = combineReducers({
  user: userReducer,
  photo: photoReducer
});

export default rootReducer;

import { combineReducers } from "redux";
import { RootReducer } from "./types";

import app from "./app/reducer";

export default combineReducers<RootReducer>({
  app,
});

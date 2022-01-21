import { createStore, applyMiddleware } from "redux";
import { createWrapper } from "next-redux-wrapper";
import logger from "redux-logger";

import rootReducer from "./root-reducer";

const middleware = process.env.NODE_ENV !== "production" ? [] : [logger];

const makeStore = () =>
  createStore(rootReducer, applyMiddleware(...middleware));

export const wrapper = createWrapper(makeStore);

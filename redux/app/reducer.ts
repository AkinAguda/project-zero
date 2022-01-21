import { Reducer } from "redux";
import { webglSupport } from "@hzn/utils/functions";
import { AppInterface } from "./types";

const INITIAL_STATE: AppInterface = {
  webgl: webglSupport(),
  loading: false,
};

const appReducer: Reducer<AppInterface> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default appReducer;

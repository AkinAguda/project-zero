import { AppInterface } from "./app/types";

export interface RootReducer {
  app: AppInterface;
}

export interface RequestStates {
  requesting: boolean;
  failed: any;
  success: boolean;
}

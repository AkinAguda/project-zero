import { Filter } from "@hzn/hooks/FilterFrame/types";

export const getFilterBasedOnActive = (active: boolean): Filter[] => {
  if (active) {
    return [{ type: "NORMAL" }];
  } else {
    return [{ type: "BOX_BLUR", intensity: 5 }];
  }
};

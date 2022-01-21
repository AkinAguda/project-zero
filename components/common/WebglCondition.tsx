import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootReducer } from "@hzn/redux/types";

const WebglCondition: React.FC<{ usesWebgl: boolean }> = ({
  children,
  usesWebgl,
}) => {
  const { app } = useSelector((state: RootReducer) => state);
  return (
    (app.webgl && usesWebgl && <>{children}</>) ||
    (!app.webgl && !usesWebgl && <>{children}</>) || <></>
  );
};

export default WebglCondition;

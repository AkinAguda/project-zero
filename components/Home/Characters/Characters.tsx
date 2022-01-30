import React from "react";
import CharactersCarousel from "./CharactersCarousel";
import classes from "./Characters.module.scss";

const Characters: React.FC = () => (
  <div className={classes.container}>
    <CharactersCarousel />
  </div>
);

export default Characters;

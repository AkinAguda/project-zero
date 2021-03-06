import Head from "next/head";
import type { NextPage } from "next";
import Mobs from "./Mobs";
import Characters from "./Characters";
import classes from "./Home.module.css";

const Home: NextPage = () => (
  <div className={classes.container}>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <Mobs />
      <Characters />
    </main>
  </div>
);

export default Home;

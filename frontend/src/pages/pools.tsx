import type { NextPage } from "next";
import Head from "next/head";
import { PoolsView } from "../views";

const Pool: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Meme Relaunch Pools</title>
        <meta
          name="description"
          content="Meme Relaunch Pools"
        />
      </Head>
      <PoolsView />
    </div>
  );
};

export default Pool;

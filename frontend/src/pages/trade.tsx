import type { NextPage } from "next";
import Head from "next/head";
import { TradeView } from "../views";

const Trade: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Join the relaunch</title>
        <meta
          name="description"
          content="Join the relaunch"
        />
      </Head>
      <TradeView />
    </div>
  );
};

export default Trade;

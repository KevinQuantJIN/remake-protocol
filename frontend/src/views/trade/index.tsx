
import { FC } from "react";
import { SignMessage } from '../../components/SignMessage';
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import Swap from "components/launchpad";

export const TradeView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h2 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Repechage
        </h2>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          < Swap />
        </div>
      </div>
    </div>
  );
};

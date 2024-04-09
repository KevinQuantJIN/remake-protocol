
import { FC } from "react";
import { SignMessage } from '../../components/SignMessage';
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import { GetPools } from '../../components/getPools';
export const PoolsView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
     <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-center py-8">
    Current Pools
  </h2> 
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <GetPools/>
        </div>
      </div>
    </div>
  );
};

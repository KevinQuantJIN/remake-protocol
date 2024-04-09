// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';
import { CreatePoolForm } from "../../components/create-pool-form";

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (

    <div className=" text-white">
     <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-center py-8">
    Remake Protocol
  </h2> 
     <div className="flex flex-row text-white p-4 md:p-8">
     
  {/* Step 1 */}
  <div className="basis-1/4 md:basis-1/3 flex flex-col items-center justify-normal">
    <div className="text-2xl font-bold mb-2">01</div>
    <div className="text-lg font-bold text-center mb-1">Fill Address</div>
    <p className="text-sm text-center">Fill the token mint address below.</p>
  </div>

  {/* Step 2 */}
  <div className="basis-1/4 md:basis-1/3 flex flex-col items-center justify-normal">
    <div className="text-2xl font-bold mb-2">02</div>
    <div className="text-lg font-bold text-center mb-1">Fetch Metadata</div>
    <p className="text-sm text-center">Fetch the token metadata.</p>
  </div>

  {/* Step 3 */}
  <div className="basis-1/2 md:basis-1/3 flex flex-col items-center justify-normal">
    <div className="text-2xl font-bold mb-2">03</div>
    <div className="text-lg font-bold text-center mb-1">Create Pool</div>
    <p className="text-sm text-center">Create the relaunch pool.</p>
  </div>
</div>
<div className="flex justify-center mt-5 mb-20">
      <div className="flex justify-center mt-5">
        <CreatePoolForm></CreatePoolForm>
      </div>
    </div>
    </div>
  );
};

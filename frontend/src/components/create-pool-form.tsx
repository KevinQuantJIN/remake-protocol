import React, { FC, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PublicKey } from '@solana/web3.js';
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import * as web3 from '@solana/web3.js';
import { CreatePool } from '../components/createPool';
const PROGRAM_ID = new PublicKey('2wMP4GLFkKV3eZnr17PnB4JStRzUN4oet4xmvmgHWq9t');
const STAKE_POOL_STATE_SEED = "your_stake_pool_state_seed";
const VAULT_SEED = "your_vault_seed";

const clusterUrl = 'https://api.devnet.solana.com';


type FormData = {
  mintAddress: string;
};


export const CreatePoolForm: FC = () => {
  const [mintAddress, setMintAddress] = useState('');

  const [umi, setUmi] = useState(null);
  useEffect(() => {
    const newUmi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata());
    setUmi(newUmi);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [digitalAsset, setDigitalAsset] = useState(null);
  const { publicKey } = useWallet();
  const [notification, setNotification] = useState<{ type: string; message: string; } | null>(null);
  const [showCreatePoolButton, setShowCreatePoolButton] = useState(false);


  const onSubmit = useCallback(async (data: FormData) => {
    if (!umi) return;

    try {
      if (!publicKey) throw new Error('Wallet not connected!');
      const asset = await fetchDigitalAsset(umi, data.mintAddress);
      setMintAddress(data.mintAddress);

      setDigitalAsset(asset);
      setShowCreatePoolButton(true); // Show 'Create Pool' button
      setNotification({ type: 'success', message: 'Asset fetched successfully!' });
    } catch (error: any) {
        
      console.error('Error fetching asset metadata:', error);
      setNotification({ type: 'error', message: `Fetch failed: ${error?.message}` });
    }
  }, [umi, publicKey]);

  const bigIntReplacer = (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString(); // Convert BigInt to a string
    } else {
      return value; // Leave other values unchanged
    }
  };
  
  // Usage with JSON.stringify
  const jsonString = JSON.stringify(digitalAsset, bigIntReplacer);
  return (
    <div className="bg-[#1a1c1d] p-10 flex flex-col gap-6 pb-6 rounded-lg">
      <h3 className="text-xl text-[#c7f464] uppercase text-center mb-4">
        Create your relaunch pool
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter token mint address"
          className="px-4 py-2 rounded bg-white text-gray-800"
          {...register('mintAddress', { required: true })}
        />
        {errors.mintAddress && <p className="text-red-500">Token mint address is required.</p>}
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring"
          disabled={!publicKey}
        >
          Fetch Token Metadata
        </button>
      </form>
      {digitalAsset && digitalAsset.metadata && (
        <div className="metadata-display">
          <p><strong>Name:</strong> {digitalAsset.metadata.name}</p>
          <p><strong>Symbol:</strong> {digitalAsset.metadata.symbol}</p>
          
        </div>
      )}
      {showCreatePoolButton && (
  <CreatePool mintAddress={mintAddress} />
  
)}
    </div>
  );
};
export default CreatePoolForm;

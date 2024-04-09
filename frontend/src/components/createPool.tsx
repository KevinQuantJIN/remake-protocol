import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from "react"
import { AnchorProvider, Program } from "@project-serum/anchor";
import idl from "../IDL/idl.json";
import { PublicKey } from "@solana/web3.js";
import { utils } from '@noble/ed25519';
import { web3 } from '@project-serum/anchor';
const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
import { verify } from '@noble/ed25519';
const PROGRAM_ID = new PublicKey(
    "FXzZhZYKx6v2GXMJad9Heh2V1wejywT9hxoQvnrJkzXy"
    )
    const Notification = ({ message, type }) => {
        if (!message) return null;
    
        const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
        return (
            <div className={`${bgColor} text-white p-2 rounded`}>
                {message}
            </div>
        );
    };
    interface CreatePoolProps {
        mintAddress: string;
      }
      
export const CreatePool: FC<CreatePoolProps>  = ({ mintAddress }) => {
    const [notification, setNotification] = useState({ message: '', type: '' });

    const ourWallet = useWallet();
    const mintPublicKey = new PublicKey(mintAddress);
    const tokenProgramPublicKey = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    const { connection } = useConnection();

    const getProvider = () => {
        const provider = new AnchorProvider(connection, ourWallet, AnchorProvider.defaultOptions());
        return provider;
    }

    const createPool = async () => {
        try {
            const anchProvider = getProvider();
            const program = new Program(idl_object, PROGRAM_ID, anchProvider);

            const [pool_state] = await PublicKey.findProgramAddressSync([
                mintPublicKey.toBuffer(), Buffer.from("state", "utf-8")]
                ,program.programId);
            const [vault_authority] = await PublicKey.findProgramAddressSync([ 
                    Buffer.from("vault_authority", "utf-8")], program.programId);
            const [token_vault] = await PublicKey.findProgramAddressSync([mintPublicKey.toBuffer(), 
                vault_authority.toBuffer(), 
                Buffer.from("vault", "utf-8")], program.programId);
            
            await program.methods.initPool().accounts({
                poolState: pool_state,
                tokenVault: token_vault,
                tokenMint: mintPublicKey,
                programAuthority: anchProvider.wallet.publicKey,
                vaultAuthority: vault_authority,
                systemProgram: web3.SystemProgram.programId,
                tokenProgram: tokenProgramPublicKey,
                rent: web3.SYSVAR_RENT_PUBKEY,
            }).rpc();
            console.log("Pool created successfully!" + pool_state.toString());
            setNotification({ message: "Pool created successfully!", type: 'success' });

        } catch (error) {
            console.log(error)
            setNotification({ message: "Error creating pool: " + error.message, type: 'error' });

        }
    }

    return (
        <div className="flex flex-col gap-4">
            <button 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring"
          onClick={createPool}>Create Pool</button>
            <Notification message={notification.message} type={notification.type} />

        </div>
    )
};
export default CreatePool;

import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import React, { FC, useState, useEffect, useCallback } from 'react';
import { AnchorProvider, Program } from "@project-serum/anchor";
import idl from "../IDL/idl.json";
import { PublicKey, GetProgramAccountsFilter } from "@solana/web3.js";
import { web3, BN } from '@project-serum/anchor';
const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
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
export const GetPools: FC = () => {
    const [notification, setNotification] = useState({ message: '', type: '' });

    const ourWallet = useWallet();
    const tokenProgramPublicKey = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    const { connection } = useConnection();
    const [pools, setPools] = useState([]);
    const [stakeAmount, setStakeAmount] = useState(0);

    const getProvider = () => {
        const provider = new AnchorProvider(connection, ourWallet, AnchorProvider.defaultOptions());
        return provider;
    }

    const getPools = async () => {
        const anchProvider = getProvider();
        const program = new Program(idl_object, PROGRAM_ID, anchProvider);
    
        try {
            const allPoolAccounts = await connection.getProgramAccounts(program.programId);
    
            const pools = await Promise.all(
                allPoolAccounts.map(async poolAccount => {
                    const poolState = await program.account.poolState.fetch(poolAccount.pubkey);
    
                    // Extracting only the necessary fields
                    return {
                        tokenMint: poolState.tokenMint,
                        authority: poolState.authority,
                        initializedAt: poolState.initializedAt,
                        userDepositAmt: poolState.userDepositAmt,
                        processPercentage: poolState.processPercentage,
                        tokenTotalSupply: poolState.tokenTotalSupply,
                        pubkey: poolAccount.pubkey
                    };
                })
            );
    
            console.log(pools);
            setPools(pools); // Assuming setPools is a state setter function
        } catch (error) {
            console.error("Error while getting the pool states:", error);
        }
    }
    
    const initPoolEntry = async (mintPublicKey) => {
        try {
            const anchProvider = getProvider();
            const program = new Program(idl_object, PROGRAM_ID, anchProvider);

            const [user_stake_entry] = await PublicKey.findProgramAddressSync([
                anchProvider.wallet.publicKey.toBuffer(), mintPublicKey.toBuffer(),Buffer.from("stake_entry", "utf-8")]
                ,program.programId);
            const [pool_state] = await PublicKey.findProgramAddressSync([ mintPublicKey.toBuffer(),
                    Buffer.from("state", "utf-8")], program.programId);
            console.log(
                pool_state, user_stake_entry
            )
            await program.methods.initStakeEntry().accounts({
                poolState: pool_state,
                userStakeEntry: user_stake_entry,
                user: anchProvider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            }).rpc();
            
            console.log("Pool entry created successfully!" + user_stake_entry.toString());
            setNotification({ message: "Pool entry created successfully!", type: 'success' });

        } catch (error) {
            console.log(error)
            setNotification({ message: "Error creating pool entry: " + error.message, type: 'error' });

        }
    }

    const stake = async (amount,mintPublicKey) => {
        try {
            
            const anchProvider = getProvider();
            const program = new Program(idl_object, PROGRAM_ID, anchProvider);
            const filters:GetProgramAccountsFilter[] = [
                {
                  dataSize: 165,    //size of account (bytes)
                },
                {
                  memcmp: {
                    offset: 32,     //location of our query in the account (bytes)
                    bytes: ourWallet.publicKey.toString(),  //our search criteria, a base58 encoded string
                  }            
                },
                {
                    memcmp: {
                    offset: 0, //number of bytes
                    bytes: mintPublicKey, //base58 encoded string
                    },
                }
             ];
            const [pool] = await PublicKey.findProgramAddressSync([
                mintPublicKey.toBuffer(), Buffer.from("state", "utf-8")]
                ,program.programId);
            const [vault_authority] = await PublicKey.findProgramAddressSync([ 
                    Buffer.from("vault_authority", "utf-8")], program.programId);
            const [token_vault] = await PublicKey.findProgramAddressSync([mintPublicKey.toBuffer(), 
                vault_authority.toBuffer(), 
                Buffer.from("vault", "utf-8")], program.programId);
            const [user_stake_entry] = await PublicKey.findProgramAddressSync([
                anchProvider.wallet.publicKey.toBuffer(), mintPublicKey.toBuffer(),Buffer.from("stake_entry", "utf-8")]
                ,program.programId);
            const token_accounts = await connection.getParsedProgramAccounts(
                tokenProgramPublicKey,   //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
                    {filters: filters}
                );
            
            amount = new BN(amount);
            await program.methods.stake(amount).accounts({
                pool: pool,
                tokenVault: token_vault,
                user: anchProvider.wallet.publicKey,
                userStakeEntry: user_stake_entry,
                userTokenAccount: token_accounts[0].pubkey,
                systemProgram: web3.SystemProgram.programId,
                tokenProgram: tokenProgramPublicKey,
            }).rpc();
            console.log("Stake" + amount + "successfully!" + pool.toString());
            setNotification({ message: "Stake" + amount + "successfully!", type: 'success' });

        } catch (error) {
            console.log(error)
            setNotification({ message: "Error unstake pool: " + error.message, type: 'error' });

        }
    }

    const unstake = async (mintPublicKey ) => {
        try {
            const anchProvider = getProvider();
            const program = new Program(idl_object, PROGRAM_ID, anchProvider);

            const [pool] = await PublicKey.findProgramAddressSync([
                mintPublicKey.toBuffer(), Buffer.from("state", "utf-8")]
                ,program.programId);
            const [vault_authority] = await PublicKey.findProgramAddressSync([ 
                    Buffer.from("vault_authority", "utf-8")], program.programId);
            const [token_vault] = await PublicKey.findProgramAddressSync([mintPublicKey.toBuffer(), 
                vault_authority.toBuffer(), 
                Buffer.from("vault", "utf-8")], program.programId);
            const [user_stake_entry] = await PublicKey.findProgramAddressSync([
                    anchProvider.wallet.publicKey.toBuffer(), mintPublicKey.toBuffer(),Buffer.from("stake_entry", "utf-8")]
                    ,program.programId);
            const token_account = await connection.getTokenAccountsByOwner(anchProvider.wallet.publicKey, {
                        mint: mintPublicKey});
            await program.methods.unstake().accounts({
                pool: pool,
                tokenVault: token_vault,
                tokenMint: mintPublicKey,
                user: anchProvider.wallet.publicKey,
                userStakeEntry: user_stake_entry,
                userTokenAccount: token_account.value[0].pubkey,
                vaultAuthority: vault_authority,
                systemProgram: web3.SystemProgram.programId,
                tokenProgram: tokenProgramPublicKey,
            }).rpc();
            console.log("Unstake successfully!" + pool.toString());
            setNotification({ message: "Unstake successfully!", type: 'success' });

        } catch (error) {
            console.log(error)
            setNotification({ message: "Error unstake pool: " + error.message, type: 'error' });

        }
        
    }
    useEffect(() => {
        console.log("useEffect triggered"); // Debug log
        getPools();
    }, []);
    return (
        <div className="flex flex-col gap-4 p-4 bg-gray-800 text-white">
            <Notification message={notification.message} type={notification.type} />
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full leading-normal text-sm text-gray-300 bg-gray-700 rounded-lg">
                    <thead className="text-xs text-gray-200 uppercase bg-gray-800">
                        <tr>
                            <th className="px-4 py-2">Token Mint</th>
                            <th className="px-4 py-2">Authority</th>
                            <th className="px-4 py-2">Initialized At</th>
                            <th className="px-4 py-2">User Deposit Amount</th>
                            <th className="px-4 py-2">Token Total Supply</th>
                            <th className="px-4 py-2">Process Percentage</th>
                            <th className="px-4 py-2">Pool Account</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pools.map((pool, index) => (
                            <tr key={index} className="bg-gray-700 border-b border-gray-600">
                                <td className="px-4 py-2">{pool.tokenMint.toBase58()}</td>
                                <td className="px-4 py-2">{pool.authority.toBase58()}</td>
                                <td className="px-4 py-2">{new Date(pool.initializedAt * 1000).toLocaleString()}</td>
                                <td className="px-4 py-2">{pool.userDepositAmt.toString()}</td>
                                <td className="px-4 py-2">{pool.tokenTotalSupply.toString()}</td>
                                <td className="px-4 py-2">{pool.processPercentage.toString()}%</td>
                                <td className="px-4 py-2">{pool.pubkey.toBase58()}</td>
                                <td className="px-4 py-2 flex gap-2 items-center">
                                    <button 
    onClick={() => initPoolEntry(pool.tokenMint)}
    className="px-2 py-1 text-white bg-[#bbed42] rounded hover:bg-green-700">
                                        Init
                                    </button>
                                    <input
                                        type="number"
                                        value={stakeAmount}
                                        onChange={(e) => setStakeAmount(Number(e.target.value))}
                                        className="px-2 py-1 border rounded border-gray-500 bg-gray-600 text-white"
                                        placeholder="Amount"
                                    />
                                    <button 
    onClick={() => stake(stakeAmount, pool.tokenMint)}
    className="px-2 py-1 text-white bg-green-600 rounded hover:bg-green-700">
                                        Stake
                                    </button>
                                    <button 
    onClick={() => unstake(pool.tokenMint)}
    className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700">
                                        Unstake
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GetPools;

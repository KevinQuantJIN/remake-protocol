# Solana Meme Alchemy
## Our Goal
To let relaunch the not liquidite meme-coin easier and trustless.
## Contract Breakdown

### Meme ALchemy 

#### 1.init_pool

Initialize a new meme pool, requires a signature from the <code>program_authority</code>. The pool is a pda with the address of the token mint that the pool is intended for and "state" as seeds.

#### 2. init_stake_entry

Initialize an account to hold state about a pool's deposit position. PDA with the user's pub key, mint of token, the token mint address, and "stake_entry" as seeds.

#### 3. Stake

#### 4. Unstable

### VAMM

VAMM aims to provide virtual liquidity for the meme coin relaunch project.

#### 1. init_pool
Initialize the liquidty pool with vitual SOL liquidity.

#### 2. swap
Users can swap in the virutal liquidity pool. In certain threshold, it can only be swapped in rather than swapped out. Similar idea with Pump.Fun.

## Frontend

1. Create Pools
2. Init Pools
3. Stake Meme coin
4. Unstake Meme coin




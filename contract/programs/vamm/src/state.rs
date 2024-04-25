use {
    anchor_lang::prelude::*,
    solana_program::{pubkey, pubkey::Pubkey},
};

// Pool相关常量
pub const POOL_SEED: &str = "Pool";
pub const POOL_SIZE: usize = 32 + 32 + 8 + 8 + 8 + 32 + 1 + 32 + 1;


// memecoin相关的PDA账户内容
// memecoin存token的账户
pub const VAULT_SEED: &str = "vault";
// memecoin存token账户的拥有者
pub const VAULT_AUTH_SEED: &str = "vault_authority";

#[account]
// Vamm的池子
// size大小
// 32 + 32 + 8 + 8 + 8 + 32 + 1 + 32 + 1
pub struct Pool {
    pub program_authority           : Pubkey,   // 当前池子的程序拥有者
    pub memecoin_address            : Pubkey,   // 当前存储的memecoin的地址是啥
    pub memecoin_reserve            : u64,      // memecoin当前的储备量级
    pub sol_reserve                 : u64,      // sol当前的储备量级
    pub mini_price_ratio            : f64,      // memecoin最小价格
    pub k                           : u64,      // memecoin_reserve * (memecoin_reserve * mini_price_ratio)
    pub memecoin_token_vault        : Pubkey,   // memecoin的金库
    pub memecoin_token_vault_bump   : u8,       // memecoin的金库的bump, 后续用来签名
    pub token_vault_authority       : Pubkey,   // SPLtoken的金库持有者的pda账户(本程序可直接控制)
    pub token_vault_authority_bump  : u8,       // SPLtoken的金库持有者的pda账户的bump(本程序可直接控制)
}
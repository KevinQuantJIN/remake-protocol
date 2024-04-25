use {
  crate::{errors::*, state::*},
  anchor_lang::prelude::*,
  anchor_spl::token::{Mint, Token, TokenAccount},
};

pub fn InitPool(ctx: Context<InitPool>, memecoin_reserve, sol_reserve, mini_price_ratio) {
  let pool = &mut ctx.accounts.pool;

  // 初始化数量
  pool.memecoin_address = ctx.accounts.token_mint.key();
  pool.memecoin_reserve = memecoin_reserve;
  pool.sol_reserve      = sol_reserve;
  pool.mini_price_ratio = mini_price_ratio;

  pool.k                = (memecoin_reserve * (memecoin_reserve * mini_price_ratio)) as u64;

  // memecoin金库
  pool.memecoin_token_vault = ctx.accounts.token_vault.key();
  pool.memecoin_token_vault_bump = ctx.bumps.token_vault;

  // memecoin金库的权限地址
  pool.token_vault_authority = ctx.accounts.vault_authority.key();
  pool.token_vault_authority_bump = ctx.bumps.vault_authority;
}

#[derive(Accounts)]
pub struct InitPool<'info> {
  // 需要创建的pool的账户
  #[account(
    init,
    seeds = [token_mint.key().as_ref(), POOL_SEED.as_bytes()],
    bump,
    payer = program_authority,
    space = POOL_SIZE
  )]
  pub pool_state: Account<'info, Pool>,

  // 需要创建的memecoin的金库账户
  #[account(
    init,
    token::mint = token_mint,
    token::authority = vault_authority,
    seeds = [token_mint.key().as_ref(), vault_authority.key().as_ref(), VAULT_SEED.as_bytes()],
    bump,
    payer = program_authority
  )]
  pub token_vault: Account<'info, TokenAccount>,

  // memecoin的mint账户
  #[account(mut)]
  pub token_mint: Account<'info, Mint>,

  // 程序管理员
  #[account(mut)]
  pub program_authority: Signer<'info>,

  // 管理金库的超级管理员地址
  #[account(
    seeds = [VAULT_AUTH_SEED.as_bytes()],
    bump
  )]
  pub vault_authority: AccountInfo<'info>,

  // SPL的程序账户
  pub token_program: Program<'info, Token>,

  // 系统程序的账户
  pub system_program: Program<'info, System>,

  // 租期??
  pub rent: Sysvar<'info, Rent>,
}
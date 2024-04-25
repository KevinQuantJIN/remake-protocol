pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

use {anchor_lang::prelude::*, instructions::*};

declare_id!("2wMP4GLFkKV3eZnr17PnB4JStRzUN4oet4xmvmgHWq9t");

#[program]
pub mod hedge_take_home {
    use super::*;

    pub fn init_pool(
        ctx: Context<InitializePool>,
        effect_process_percentage: u8,
        is_support_sol_stake: bool,
        add_liquidity_ratio: u32,
    ) -> Result<()> {
        init_pool::handler(
            ctx,
            effect_process_percentage,
            is_support_sol_stake,
            add_liquidity_ratio,
        )
    }

    pub fn init_stake_entry(ctx: Context<InitEntryCtx>) -> Result<()> {
        init_stake_entry::handler(ctx)
    }

    pub fn add_liquidity(ctx: Context<StakeCtx>, memecoin_amount: u64) -> Result<()> {
        stake::add_liquidity(ctx, memecoin_amount)
    }

    pub fn add_memecoin(ctx: Context<StakeCtx>, memecoin_amount: u64) -> Result<()> {
        stake::add_memecoin(ctx, memecoin_amount)
    }
}

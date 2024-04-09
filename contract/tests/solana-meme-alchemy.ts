const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;
const assert = require("assert");

describe("Pool Program Tests", () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.solana-meme-alchemy; // Replace with your program name

  it("initializes a pool", async () => {
    // Generate a new Keypair for the creator (optional)
    const creator = anchor.web3.Keypair.generate();

    // Send transaction
    const maxTokens = new anchor.BN(100); // Set your desired max token amount
    const [poolPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("pool"), creator.publicKey.toBuffer()],
      program.programId
    );

    const txHash = await program.rpc.initializePool(maxTokens, {
      accounts: {
        pool: poolPda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [creator],
    });
    console.log(`Transaction hash: ${txHash}`);

    // Confirm transaction
    await provider.connection.confirmTransaction(txHash, "confirmed");

    // Fetch the created pool account
    const poolAccount = await program.account.pool.fetch(poolPda);

    console.log("On-chain pool data:", poolAccount);

    // Check whether the on-chain data matches the initialized data
    assert.strictEqual(poolAccount.creator.toBase58(), creator.publicKey.toBase58());
    assert.strictEqual(poolAccount.maxTokens.toNumber(), maxTokens.toNumber());
  });
});

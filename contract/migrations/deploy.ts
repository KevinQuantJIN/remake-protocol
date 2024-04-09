const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

async function main() {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  // Read the generated IDL.
  const idl = JSON.parse(require('fs').readFileSync('./target/idl/meme_alchemy.json', 'utf8'));

  // Load the program from the IDL.
  const programId = new anchor.web3.PublicKey('2wMP4GLFkKV3eZnr17PnB4JStRzUN4oet4xmvmgHWq9t');
  const program = new anchor.Program(idl, programId);

  // Execute the deployment.
  console.log("Deploying...");
  await program.rpc.initialize({
    accounts: {
      yourAccount: SystemProgram.programId,
    },
  });
  console.log("Deployment successful!");
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});

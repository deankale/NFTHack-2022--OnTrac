// Call this using the startAccountabilityFlow task in hardhat.config.ts
// >>> npx hardhat startAccountabilityFlow --network localhost --to ADDRESS

import { Framework } from '@superfluid-finance/sdk-core';
import { SuperAccountabilityXABI } from './SuperAccountabilityXABI';
import { networkConfig } from './token-addresses';

import { toast } from 'react-toastify';

export async function startAccountabilityFlow(
  name,
  desc,
  receiver,
  flowRate,
  ethers,
  provider,
  taskDuration
) {
  const network = await provider.getNetwork();
  const superAccountabilityXAddr =
    networkConfig[network.chainId].superAccountabilityX;
  /* -------------------------------------------------  */
  // 1. First we create the new task for the user by calling the smart contract
  const superAccountabilityX = new ethers.Contract(
    superAccountabilityXAddr,
    SuperAccountabilityXABI,
    provider.getSigner()
  );

  const judge = receiver;
  const currentBlock = await provider.getBlockNumber();
  const currentBlockTimestamp = (await provider.getBlock(currentBlock))
    .timestamp;
  const taskExpirationDate = currentBlockTimestamp + taskDuration;
  console.log('Calling contract to create task...');
  toast('This first transaction adds your Task to the OnTrac smart contract.');
  const createTaskTx = await superAccountabilityX.createTask(
    name,
    desc,
    receiver,
    judge,
    flowRate,
    taskExpirationDate
  );
  toast('Please wait for the transaction to complete');
  await createTaskTx.wait();

  /* -------------------------------------------------  */
  // 2. Then we initialize the superfluid framework to make txs with the contract
  const sf = await Framework.create({
    chainId: network.chainId,
    provider: provider,
    // This is only for localhost provider
    // customSubgraphQueriesEndpoint: 'http://localhost:8000/',
    // resolverAddress: '0x851d3dd9dc97c1df1DA73467449B3893fc76D85B',
  });
  const signerAddress = (await provider.listAccounts())[0];
  const etherSigner = provider.getSigner();
  const signer = sf.createSigner({
    signer: etherSigner,
  });

  // -------------------------------------------------------- //
  // GETTING RID OF THIS WHOLE SECTION BECAUSE IT MAKES THE DEMO TOO SLOW
  // WE WILL HAVE TO MAKE SURE THE USER HAS FDAIX IN HIS WALLET BEFORE STARTING THE DEMO
  // VISIT https://app.superfluid.finance/ FOR THAT
  // -------------------------------------------------------- //

  // We might need to first mint some fDAI for the user if we don't want to force
  // him to visit the superfluid dashboard first
  // Otherwise visit https://rinkeby.etherscan.io/address/0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7#writeContract
  // and mint some for him manually

  const fUSDCxAddr = networkConfig[network.chainId].fusdcx;
  // const fDAIx = await sf.loadSuperToken(fDAIxAddr);

  // // First we query the user's fDAIx balance
  // let fDAIxBalanceWei = await fDAIx.balanceOf({
  //   account: signerAddress,
  //   providerOrSigner: signer,
  // });
  // let fDAIxBalance = ethers.utils.formatEther(fDAIxBalanceWei);
  // console.log(`Your fDAIx balance is ${fDAIxBalance}.`);

  // /* -------------------------------------------------  */
  // // 3. If user doesn't have sufficient fDAIx, then we upgrade his fDAIs into fDAIx
  // const totalAmountTransferred = flowRate * taskDuration / 1e18;
  // if (Number(fDAIxBalance) < totalAmountTransferred) {
  //   console.log(
  //     `Upgrading ${totalAmountTransferred} fake-DAI (fDAI) into ${totalAmountTransferred} fake-super-DAI (fDAIx)`
  //   );

  //   const underlyingTokenBalance = await fDAIx.underlyingToken.balanceOf({
  //     account: signerAddress,
  //     providerOrSigner: provider
  //   });
  //   console.log(`Underlying token balance: ${underlyingTokenBalance}`)
  //   if (underlyingTokenBalance < totalAmountTransferred) {
  //     toast("Your account doesn't have sufficient fDAI tokens!");
  //   }

  //   // 3.1 We first approve the fDAIx contract to transfer fDAI from sender to itself
  //   const approveOperation = fDAIx.underlyingToken.approve({
  //     receiver: fDAIxAddr,
  //     amount: ethers.utils.parseEther('100').toString(),
  //   });
  //   let txnResponse = await approveOperation.exec(signer);
  //   let txnReceipt = await txnResponse.wait();
  //   console.log('Approved fDAIx contract to transfer 100 DAI on your behalf');

  //   // 3.2 Then we upgrade his fDAI to fDAIx
  //   const upgradeOperation = fDAIx.upgrade({
  //     amount: ethers.utils.parseEther('100').toString(),
  //   });
  //   txnResponse = await upgradeOperation.exec(signer);
  //   txnReceipt = await txnResponse.wait();

  //   fDAIxBalanceWei = await fDAIx.balanceOf({
  //     account: signerAddress,
  //     providerOrSigner: signer,
  //   });
  //   fDAIxBalance = ethers.utils.formatEther(fDAIxBalanceWei);
  //   console.log(`Your fDAIx balance is now ${fDAIxBalance}.`);
  // }

  /* -------------------------------------------------  */
  // 4. Then we can finally actually start the flow from the user to contract
  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: (await provider.listAccounts())[0],
      receiver: superAccountabilityXAddr,
      flowRate: flowRate,
      superToken: fUSDCxAddr,
      // userData?: string
    });

    console.log('Creating your stream...');
    toast(
      'This second transaction starts your flow to the OnTrac smart contract.'
    );
    const tx = await createFlowOperation.exec(signer);
    toast('Please wait for the transaction to complete');
    await tx.wait();

    console.log(
      `Congrats - you've just created a money stream!
        View Your Stream At: https://app.superfluid.finance/dashboard/${signerAddress}
        Network: Rinkeby
        Super Token: fDAIx
        Sender: ${signerAddress}
        Receiver: ${superAccountabilityXAddr}
        FlowRate: ${flowRate}
        `
    );

    return true;
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

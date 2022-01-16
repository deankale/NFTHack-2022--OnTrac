// Call this using the startAccountabilityFlow task in hardhat.config.ts
// >>> npx hardhat startAccountabilityFlow --network localhost --to ADDRESS

import { Framework } from '@superfluid-finance/sdk-core';
import { fUSDCABI } from './fUSDCABI';
import { networkConfig } from './token-addresses';

import { toast } from 'react-toastify';

export async function mintUSDCx(
  receiver,
  amount,
  ethers,
  provider
) {
  console.log(provider);
  const network = await provider.getNetwork();
  const fUSDCaddr =
    networkConfig[network.chainId].fusdc;
  /* -------------------------------------------------  */
  // 1. First we mint fUSDC from the contract
  const fUSDC = new ethers.Contract(
    fUSDCaddr,
    fUSDCABI,
    provider.getSigner()
  );

  console.log('Calling contract to create mint fUSDC...');
  toast('This first transaction adds will mint you 1000 fUSDC for testing.');
  const mintTx = await fUSDC.mint(
    receiver,
    amount
  );
  toast('Please wait for the mint transaction to complete');
  await mintTx.wait();

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


  const fUSDCxAddr = networkConfig[network.chainId].fusdcx;
  const fUSDCx = await sf.loadSuperToken(fUSDCxAddr);

  // First we query the user's fDAIx balance
  let fUSDCxBalanceWei = await fUSDCx.balanceOf({
    account: signerAddress,
    providerOrSigner: signer,
  });
  let fUSDCxBalance = ethers.utils.formatEther(fUSDCxBalanceWei);
  console.log(`Your fDAIx balance is ${fUSDCxBalance}.`);

  // /* -------------------------------------------------  */
  // 3. If user doesn't have sufficient fDAIx, then we upgrade his fDAIs into fDAIx
  console.log(
    `Upgrading (fUSDC) into (fUSDCx)`
  );
 

// 3.1 We first approve the fDAIx contract to transfer fDAI from sender to itself
const approveOperation = fUSDCx.underlyingToken.approve({
    receiver: fUSDCxAddr,
    amount: ethers.utils.parseEther(amount).toString(),
});
let txnResponse = await approveOperation.exec(signer);
await txnResponse.wait();
console.log('Approved fUSDCx contract to transfer USDC on your behalf');

// 3.2 Then we upgrade his fDAI to fDAIx
const upgradeOperation = fUSDCx.upgrade({
    amount: ethers.utils.parseEther(amount).toString(),
});
txnResponse = await upgradeOperation.exec(signer);
await txnResponse.wait();

fUSDCxBalance = await fUSDCx.balanceOf({
    account: signerAddress,
    providerOrSigner: signer,
});
fUSDCxBalance = ethers.utils.formatEther(fUSDCxBalance);
console.log(`Your fDAIx balance is now ${fUSDCxBalance}.`);
  

  
}

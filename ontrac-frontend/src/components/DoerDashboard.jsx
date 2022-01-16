import { useContext, useEffect, useState } from 'react';
import { SuperAccountabilityXABI } from '../SuperAccountabilityXABI';
import BlockchainContext from './BlockchainContext';
import { networkConfig } from '../token-addresses';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Framework } from '@superfluid-finance/sdk-core';
import { SuperAccountabilityNFTABI } from '../SuperAccountabilityNFTABI';

let flowInterval;
function DoerDashboard({ setShowNewTask }) {
  const provider = useContext(BlockchainContext).provider;
  const ethers = useContext(BlockchainContext).ethers;
  const [taskData, setTaskData] = useState({
    title: '',
    id: '',
    partner: '',
    deadline: '',
    flowTimestamp: 0,
    flowRate: 0,
    flowedSoFar: '',
    status: '',
    chosenFlowRate: 0,
  });
  const [isFlowRateUpdating, setIsFlowRateUpdating] = useState(false);
  const [refreshDashboard, setRefreshDashboard] = useState(false);

  useEffect(() => {
    const getTaskData = async () => {
      if (provider) {
        const address = (await provider.listAccounts())[0];
        const network = await provider.getNetwork();
        const superAccountabilityXAddr =
          networkConfig[network.chainId].superAccountabilityX;
        const superAccountabilityX = new ethers.Contract(
          superAccountabilityXAddr,
          SuperAccountabilityXABI,
          provider.getSigner()
        );

        const taskId = await superAccountabilityX.senderToTaskId(address);
        if (taskId.toNumber() === 0) {
          return;
        }
        const task = await superAccountabilityX.tasks(taskId);
        console.log(task);

        // We also get flowrate info
        const sf = await Framework.create({
          chainId: network.chainId,
          provider: provider,
        });
        const flowInfo = await sf.cfaV1.getFlow({
          superToken: networkConfig[network.chainId].fusdcx,
          sender: address,
          receiver: networkConfig[network.chainId].superAccountabilityX,
          providerOrSigner: provider,
        });

        setTaskData({
          title: task[0],
          id: task[2].toNumber(),
          partner: task[4],
          deadline: new Date(task[8].toNumber() * 1000).toDateString(),
          status: task[6],
          flowTimestamp: flowInfo.timestamp,
          flowRate: flowInfo.flowRate,
          chosenFlowRate: task[7].toNumber(),
        });
      }
    };
    getTaskData();
  }, [provider, refreshDashboard]);

  useEffect(() => {
    if (taskData.flowRate > 0 && !isFlowRateUpdating) {
      flowInterval = setInterval(async function () {
        const deltaT = (Date.now() - taskData.flowTimestamp) / 1000;
        setTaskData((prevState) => ({
          ...prevState,
          flowedSoFar: `${((deltaT * taskData.flowRate) / 1e18).toFixed(
            4
          )} fUSDCx`,
        }));
      }, 1000);
      setIsFlowRateUpdating(true);
    }
  }, [taskData]);

  const abandonTask = async () => {
    const network = await provider.getNetwork();
    const superAccountabilityXAddr =
      networkConfig[network.chainId].superAccountabilityX;
    const superAccountabilityX = new ethers.Contract(
      superAccountabilityXAddr,
      SuperAccountabilityXABI,
      provider.getSigner()
    );

    try {
      const tx = await superAccountabilityX.abandonTask(taskData.id);
      toast('Please wait for the transaction to complete');
      await tx.wait();
      setRefreshDashboard((prevState) => !prevState);
      clearInterval(flowInterval);
      toast('Successfully abandoned');
    } catch (e) {
      if (e.message.includes('denied')) {
        return;
      }
      toast('You cannot abandon this task');
    }
  };

  const claimNFT = async () => {
    const network = await provider.getNetwork();
    const superAccountabilityNFTAddr =
      networkConfig[network.chainId].superAccountabilityNFT;
    const superAccountabilityNFT = new ethers.Contract(
      superAccountabilityNFTAddr,
      SuperAccountabilityNFTABI,
      provider.getSigner()
    );

    try {
      const tx = await superAccountabilityNFT.mintNFT(taskData.id);
      toast('Please wait for the transaction to complete');
      await tx.wait();
      setRefreshDashboard((prevState) => !prevState);
      toast('Successfully claimed NFT!');
    } catch (e) {
      if (e.message.includes('denied')) {
        return;
      }
      toast('Already claimed. Create a new task to earn another NFT!');
    }
  };

  const startFlow = async () => {
    const network = await provider.getNetwork();
    const superAccountabilityXAddr =
      networkConfig[network.chainId].superAccountabilityX;
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
    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        sender: (await provider.listAccounts())[0],
        receiver: superAccountabilityXAddr,
        flowRate: taskData.chosenFlowRate,
        superToken: fUSDCxAddr,
        // userData?: string
      });

      console.log('Creating your stream...');
      toast('This transaction starts your flow to the OnTrac smart contract.');
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
            FlowRate: ${taskData.chosenFlowRate}
            `
      );
      setRefreshDashboard((prevState) => !prevState);
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  };

  const renderReward = (status) => {
    console.log(status);
    switch (status) {
      // Not Started - need to create flow
      case 0:
        return (
          <button
            type='button'
            onClick={startFlow}
            className='py-2 px-4 text-sm bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center  font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
          >
            Start Flow
          </button>
        );
      // Started
      case 1:
        return (
          <span className='relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight'>
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-blue-200 opacity-50 rounded-full'
            ></span>
            <span className='relative'>In Progress</span>
          </span>
        );
      // Finished
      case 2:
        return (
          <button
            type='button'
            onClick={claimNFT}
            className='py-2 px-4 text-sm bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center  font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
          >
            Claim NFT!
          </button>
        );
      // Abandoned
      case 3:
        return (
          <span className='relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight'>
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-yellow-200 opacity-50 rounded-full'
            ></span>
            <span className='relative'>Abandoned</span>
          </span>
        );
      // Expired
      case 4:
        return (
          <span className='relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight'>
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
            ></span>
            <span className='relative'>Expired</span>
          </span>
        );
    }
  };

  return (
    <div className='px-4 sm:px-8 max-w-[64rem] space-y-6'>
      <div className='inline-block bg-[#f2f3f5] text-[#4f565f] w-full shadow rounded-lg overflow-hidden'>
        <div className='flex justify-between p-4'>
          <h1 className='text-2xl'>Doer Dashboard</h1>
          <button
            type='button'
            onClick={() => {
              if (!provider) {
                toast('Please Connect Your Wallet first!');
              } else if (taskData.status === 1) {
                alert('You already have an active task!');
              } else {
                setShowNewTask(true);
              }
            }}
            className={`py-2 px-4 text-sm bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500
             focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg`}
          >
            + Create a New Task
          </button>
        </div>
        <table className='w-full'>
          <thead>
            <tr>
              <th
                scope='col'
                className='px-5 py-3  border-b border-gray-200   text-left text-sm uppercase font-normal'
              >
                Title
              </th>
              <th
                scope='col'
                className='px-5 py-3  border-b border-gray-200   text-left text-sm uppercase font-normal'
              >
                Partner
              </th>
              <th
                scope='col'
                className='px-5 py-3  border-b border-gray-200   text-left text-sm uppercase font-normal'
              >
                Flowed So Far
              </th>
              <th
                scope='col'
                className='px-5 py-3   border-b border-gray-200   text-left text-sm uppercase font-normal'
              >
                Deadline
              </th>
              <th
                scope='col'
                className='px-5 py-3   border-b border-gray-200   text-left text-sm uppercase font-normal'
              >
                Reward
              </th>
              <th
                scope='col'
                className='px-5 py-3   border-b border-gray-200   text-left text-sm uppercase font-normal'
              >
                Abandon
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                <p className='text-gray-900 whitespace-no-wrap'>
                  {taskData.title}
                </p>
              </td>

              <td className='px-5 py-5 border-b border-gray-200  text-sm'>
                {taskData.partner && (
                  <div className='flex space-x-2'>
                    <p className='text-gray-900 whitespace-no-wrap'>
                      {taskData.partner.replace(
                        taskData.partner.substring(
                          5,
                          taskData.partner.length - 4
                        ),
                        '...'
                      )}
                    </p>
                    <FaCopy
                      size={16}
                      className='cursor-pointer'
                      onClick={() => {
                        navigator.clipboard.writeText(taskData.partner);
                        toast('Copied to clipboard!');
                      }}
                    />
                  </div>
                )}
              </td>
              <td className='px-5 py-5 border-b border-gray-200  text-sm'>
                <p className='text-gray-900 whitespace-no-wrap'>
                  {taskData.flowedSoFar}
                </p>
              </td>
              <td className='px-5 py-5 border-b border-gray-200  text-sm'>
                <p className='text-gray-900 whitespace-no-wrap'>
                  {taskData.deadline}
                </p>
              </td>
              <td className='px-5 py-5 border-b border-gray-200  text-sm'>
                {renderReward(taskData.status)}
              </td>
              <td className='px-5 py-5 border-b border-gray-200  text-sm'>
                {taskData.status !== '' ? (
                  <button
                    type='button'
                    onClick={abandonTask}
                    className='py-2 px-4 text-sm bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center  font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
                  >
                    Abandon Task
                  </button>
                ) : (
                  <div></div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoerDashboard;

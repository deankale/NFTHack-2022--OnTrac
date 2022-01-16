import React from 'react';
import { startAccountabilityFlow } from '../startAccountabilityFlow';
import { useContext } from 'react';
import BlockchainContext from './BlockchainContext';

export default function Review({ nextPage, prevPage, task }) {
  const provider = useContext(BlockchainContext).provider;
  const ethers = useContext(BlockchainContext).ethers;

  return (
    <div class='bg-white rounded-lg shadow sm:max-w-4xl sm:overflow-hidden'>
      <div class='px-4 py-8 sm:px-10'>
        <div class='relative mt-6'>
          <div class='absolute inset-0 flex items-center'>
            <div class='w-full border-t border-gray-300'></div>
          </div>
          <div class='relative flex justify-center text-3xl leading-5'>
            <span class='px-2 text-gray-500 bg-white'>Review Details</span>
          </div>
        </div>
        <div class='mt-6'>
          <div class='p-2'>
            <h1>Task Name</h1>
            <p>{task.title}</p>
          </div>
          <div class='p-2'>
            <h1>Task Desc</h1>
            <p>{task.desc}</p>
          </div>
          <div class='p-2'>
            <h1>Partner</h1>
            <p>{task.wallet_p}</p>
          </div>
          <div class='p-2'>
            <h1>Judge</h1>
            <p>{task.wallet_j || task.wallet_p}</p>
          </div>
          <div class='p-2'>
            <h1>Deadline</h1>
            <p>{task.deadline}</p>
          </div>
          <div class='p-2'>
            <h1>Amount of fUSDC</h1>
            <p>{task.fDAI}</p>
          </div>
          <div class='flex space-x-12'>
            <span class='block w-1/2 rounded-md shadow-sm'>
              <button
                type='button'
                onClick={prevPage}
                class='py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
              >
                Back
              </button>
            </span>
            <span class='block w-1/2 rounded-md shadow-sm'>
              <button
                type='button'
                onClick={async () => {
                  let duration;
                  switch (task.deadline) {
                    case '1 Day':
                      duration = 60 * 60 * 24;
                      break;
                    case '1 Week':
                      duration = 60 * 60 * 24 * 7;
                      break;
                    case '2 Weeks':
                      duration = 60 * 60 * 24 * 7 * 2;
                      break;
                    case '1 Month':
                      duration = 60 * 60 * 24 * 30;
                      break;
                    case '3 Months':
                      duration = 60 * 60 * 24 * 30 * 3;
                      break;
                  }

                  const result = await startAccountabilityFlow(
                    task.title,
                    task.desc,
                    task.wallet_p,
                    parseInt((task.fDAI * 1e18) / duration),
                    ethers,
                    provider,
                    duration
                  );

                  if (result) {
                    nextPage();
                  }
                }}
                class='py-2 px-4  bg-green-600 hover:bg-green-500 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
              >
                Confirm
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useContext } from 'react';
import BlockchainContext from './BlockchainContext';
import { toast } from 'react-toastify';

export default function Wallets({ nextPage, prevPage, task, setTask }) {
  const [toggle, setToggle] = useState(false);
  const [addr, setAddr] = useState('');
  const provider = useContext(BlockchainContext).provider;
  if (provider) {
    provider.listAccounts().then((address) => {
      setAddr(address[0]);
    });
  }

  return (
    <div class='bg-white rounded-lg shadow sm:max-w-4xl sm:overflow-hidden'>
      <div class='px-4 py-8 sm:px-10'>
        <div class='relative mt-6'>
          <div class='absolute inset-0 flex items-center'>
            <div class='w-full border-t border-gray-300'></div>
          </div>
          <div class='relative flex justify-center text-3xl leading-5'>
            <span class='px-2 text-gray-500 bg-white'>Choose your partner</span>
          </div>
        </div>
        {/* ^Heading section */}

        <div class='mt-6'>
          <div class='w-full space-y-6'>
            <div class='w-full'>
              <div class=' relative '>
                <label for='required-wallet-p' class='text-gray-700'>
                  Partner wallet
                  <span class='text-red-500 required-dot'>*</span>
                </label>
                <input
                  value={task.wallet_p}
                  onChange={(event) =>
                    setTask({ ...task, wallet_p: event.target.value })
                  }
                  type='text'
                  id='required-wallet-p'
                  class=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                  name='wallet-p'
                  placeholder='Paste wallet address'
                />
              </div>
            </div>
            {/* ^Partner Wallet input box */}

            <div class='w-full'>
              <h1>Judge (optional)</h1>
              <div class=' relative '>
                <input
                  type='text'
                  id='judge-wallet'
                  class=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                  name='wallet-j'
                  placeholder='Paste wallet address'
                  value={task.wallet_j}
                  onChange={(event) =>
                    setTask({ ...task, wallet_j: event.target.value })
                  }
                />
              </div>
            </div>
            {/* ^Judge Wallet input box */}

            <div>
              <div class='mb-3'>
                <div class='relative inline-block w-10 mr-2 align-middle select-none'>
                  <input
                    type='checkbox'
                    name='toggle'
                    id='Blue'
                    onChange={(event) => setToggle(event.target.checked)}
                    class='required checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer'
                  />
                  <label
                    for='Blue'
                    class='block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer'
                  ></label>
                </div>
                <span class='text-gray-400 font-medium'>
                  I acknowledge that my partner is someone (not myself) who I
                  can trust completely to grade me fairly.
                </span>
              </div>
            </div>
            {/* ^Disclaimer toggle */}

            {/* v Back and forward buttons */}
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
                  disabled={!toggle || task.wallet_p === ''}
                  onClick={() => {
                    if (
                      task.wallet_p.toLocaleLowerCase() ===
                      addr.toLocaleLowerCase()
                    ) {
                      toast(
                        'Partner address cannot be the same as your address!'
                      );
                    } else {
                      nextPage();
                    }
                  }}
                  type='button'
                  class='py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
                >
                  Next
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

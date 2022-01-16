import React, { useState, useEffect } from 'react';
import Radio from './Radio';

export default function Stream({ nextPage, prevPage, task, setTask }) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setTask({ ...task, deadline: duration });
  }, [duration]);

  return (
    <div class='bg-white rounded-lg shadow sm:max-w-4xl sm:overflow-hidden'>
      <div class='px-4 py-8 sm:px-10'>
        <div class='relative mt-6'>
          <div class='absolute inset-0 flex items-center'>
            <div class='w-full border-t border-gray-300'></div>
          </div>
          <div class='relative flex justify-center text-3xl leading-5'>
            <span class='px-2 text-gray-500 bg-white'>Duration and Cost</span>
          </div>
        </div>
        <div class='mt-6'>
          <div class='w-full space-y-6'>
            <div class='w-full'>
              <h1>Set a deadline</h1>
              <div class=' relative '>
                <Radio setDuration={setDuration} />
              </div>
            </div>
            {/* ^Deadline radio */}
            <div class=' relative '>
              <label for='required-fDAI' class='text-gray-700'>
                How much fUSDCx will you drop? (Remember: if you complete your
                goal, you get refunded! With a bonus 🙈)
                <span class='text-red-500 required-dot'>*</span>
              </label>
              <input
                type='text'
                id='required-fDAI'
                class=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                name='fDAI'
                placeholder='# in fUSDCx'
                value={task.fDAI}
                onChange={(event) =>
                  setTask({ ...task, fDAI: event.target.value })
                }
              />
            </div>
            {/* ^fDAI amount box */}
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
                  type='button'
                  disabled={task.duration === '' || task.fDAI === ''}
                  onClick={nextPage}
                  class='py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
                >
                  Review
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

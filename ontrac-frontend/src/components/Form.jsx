import React from 'react';
import MyRadioGroup from './Radio';

function Form() {
  return (
    <form className='container max-w-[38%] shadow-md md:w-3/4'>
      <div className='p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5' />
      <div className='space-y-6 bg-white'>
        <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
          <h2 className='max-w-sm mx-auto md:w-1/3'>Task Name</h2>
          <div className='max-w-sm mx-auto md:w-2/3'>
            <div className=' relative '>
              <input
                type='text'
                id='user-info-email'
                className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                placeholder='My awesome task'
              />
            </div>
          </div>
        </div>
        <hr />
        <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
          <h2 className='max-w-sm mx-auto md:w-1/3'>Describe your task</h2>
          <div className='max-w-sm mx-auto space-y-5 md:w-2/3'>
            <div>
              <div className=' relative '>
                <textarea
                  type='text'
                  id='user-info-phone'
                  className='rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                  placeholder='i.e I have to write one blog post minimum 500 words'
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className='w-full p-8 space-y-4 text-gray-500 md:inline-flex md:flex-col md:space-y-8'>
          <h2 className=''>Choose a deadline tier</h2>
          <MyRadioGroup />
        </div>
        <hr />
        <div className='w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3'>
          <button
            type='submit'
            className='py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default Form;

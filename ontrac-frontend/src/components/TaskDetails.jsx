import React from 'react';

export default function TaskDetails({
  nextPage,
  task,
  setTask,
  setShowNewTask,
}) {
  return (
    <div className='rounded-lg shadow sm:max-w-4xl sm:overflow-hidden'>
      <div className='px-4 py-8 sm:px-10'>
        <div className='relative mt-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center text-3xl leading-5'>
            <span className='px-2 text-gray-500 bg-white'>Create a Task</span>
          </div>
        </div>
        <div className='mt-6'>
          <div className='w-full space-y-6'>
            <div className='w-full'>
              <div className=' relative '>
                <label className='text-gray-700'>
                  Title
                  <span className='text-red-500 required-dot'>*</span>
                </label>
                <input
                  type='text'
                  id='required-title'
                  className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                  name='title'
                  placeholder='i.e. Blog post #1'
                  value={task.title}
                  onChange={(event) =>
                    setTask({ ...task, title: event.target.value })
                  }
                />
              </div>
            </div>
            {/* ^Task name box */}
            <div className='w-full'>
              <div className=' relative '>
                <label className='text-gray-700'>
                  Description
                  <span className='text-red-500 required-dot'>*</span>
                </label>
                <input
                  type='text'
                  id='required-desc'
                  className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                  name='desc'
                  placeholder='i.e. I have to publish 1 new post to my blog, minimum 500 words'
                  value={task.desc}
                  onChange={(event) =>
                    setTask({ ...task, desc: event.target.value })
                  }
                />
              </div>
            </div>
            {/* ^Task Desc box */}
            {/* v Back and forward buttons */}
            <div className='flex space-x-12'>
              <span className='block w-1/2 rounded-md shadow-sm'>
                <button
                  type='button'
                  onClick={() => setShowNewTask(false)}
                  className='py-2 px-4  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
                >
                  Cancel
                </button>
              </span>
              <span className='block w-1/2 rounded-md shadow-sm'>
                <button
                  type='button'
                  onClick={nextPage}
                  disabled={task.title === '' || task.desc === ''}
                  className='py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
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

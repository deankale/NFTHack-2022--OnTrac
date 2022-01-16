import { useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
const plans = [
  {
    name: '1 Day',
    sub: 'Daily Tasks',
  },
  {
    name: '1 Week',
  },
  {
    name: '2 Weeks',
    sub: 'Big Projects',
  },
  {
    name: '1 Month',
  },
  {
    name: '3 Months',
    sub: 'Bootcamp!',
  },
];

export default function MyRadioGroup({ setDuration }) {
  const [selected, setSelected] = useState(plans[0]);

  useEffect(() => {
    setDuration(selected.name);
  }, [selected]);

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <div className='flex space-x-6 place-content-center'>
        {plans.map((plan) => (
          <RadioGroup.Option
            key={plan.name}
            value={plan}
            className={({ active, checked }) =>
              `${
                active
                  ? 'ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60'
                  : ''
              }
                  ${
                    checked
                      ? 'bg-indigo-700 bg-opacity-75 text-white'
                      : 'bg-white'
                  }
                    relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`
            }
          >
            {({ checked }) => (
              <div className='flex items-center'>
                <div className='flex flex-col justify-center'>
                  <div className='text-sm w-20'>
                    <RadioGroup.Label
                      className={`font-medium  ${
                        checked ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {plan.name}
                    </RadioGroup.Label>
                  </div>
                  <RadioGroup.Description
                    className={`inline text-xs ${
                      checked ? 'text-sky-100' : 'text-gray-500'
                    }`}
                  >
                    {plan.sub}
                  </RadioGroup.Description>
                </div>
                {checked ? (
                  <CheckIcon className='w-6 h-6' />
                ) : (
                  <div className='w-6 h-6 border border-gray-300 rounded-full'></div>
                )}
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox='0 0 24 24' fill='none' {...props}>
      <circle cx={12} cy={12} r={12} fill='#fff' opacity='0.2' />
      <path
        d='M7 13l3 3 7-7'
        stroke='#fff'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

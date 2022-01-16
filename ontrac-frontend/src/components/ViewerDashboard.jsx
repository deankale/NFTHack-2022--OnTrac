import { useContext, useEffect, useState } from 'react';
import { SuperAccountabilityXABI } from '../SuperAccountabilityXABI';
import BlockchainContext from './BlockchainContext';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { networkConfig } from '../token-addresses';

function ViewerDashboard() {
  const provider = useContext(BlockchainContext).provider;
  const ethers = useContext(BlockchainContext).ethers;
  const [taskData, setTaskData] = useState([]);
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

        let taskIds = [];
        try {
          let i = 0;
          while (true) {
            const taskId = await superAccountabilityX.judgeToTaskId(address, i);
            taskIds.push(taskId.toNumber());
            i++;
          }
        } catch (e) {
          if (taskIds.length === 0) {
            toast('Nothing to view');
            return;
          }
          console.log(taskIds);
        }

        setTaskData([]);
        taskIds.forEach(async (taskId) => {
          const task = await superAccountabilityX.tasks(taskId);
          setTaskData((prevState) => [
            ...prevState,
            {
              title: task[0],
              id: task[2].toNumber(),
              sender: task[3],
              deadline: new Date(task[8].toNumber() * 1000).toDateString(),
              status: task[6],
            },
          ]);
        });
      }
    };
    getTaskData();
  }, [provider, refreshDashboard]);

  const approveTask = async (id) => {
    const network = await provider.getNetwork();
    const superAccountabilityXAddr =
      networkConfig[network.chainId].superAccountabilityX;
    const superAccountabilityX = new ethers.Contract(
      superAccountabilityXAddr,
      SuperAccountabilityXABI,
      provider.getSigner()
    );

    const tx = await superAccountabilityX.approveTask(id);
    toast('Please wait for the transaction to complete');
    await tx.wait();
    setRefreshDashboard((prevState) => !prevState);
    toast('Successfully approved task');
  };

  const expireTask = async (id) => {
    const network = await provider.getNetwork();
    const superAccountabilityXAddr =
      networkConfig[network.chainId].superAccountabilityX;
    const superAccountabilityX = new ethers.Contract(
      superAccountabilityXAddr,
      SuperAccountabilityXABI,
      provider.getSigner()
    );

    const tx = await superAccountabilityX.expireTask(id);
    toast('Please wait for the transaction to complete');
    await tx.wait();
    setRefreshDashboard((prevState) => !prevState);
    toast('Successfully expired task');
  };

  return (
    <div className='px-4 sm:px-8 max-w-3xl space-y-6'>
      <div className='inline-block bg-[#f2f3f5] text-[#4f565f] w-full shadow rounded-lg overflow-hidden'>
        <div className='flex justify-between p-4'>
          <h1 className='text-2xl'>Viewer Dashboard</h1>
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
                className='px-5 py-3   border-b border-gray-200   text-left text-sm uppercase font-normal'
              >
                Deadline
              </th>
              <th
                scope='col'
                className='px-5 py-3   border-b border-gray-200   text-left text-sm uppercase font-normal'
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {taskData.map((task) => (
              <tr key={task.id}>
                <td className='px-5 py-5 border-b border-gray-200 text-sm'>
                  <p className='text-gray-900 whitespace-no-wrap'>
                    {task.title}
                  </p>
                </td>
                <td className='px-5 py-5 border-b border-gray-200  text-sm'>
                  <div className='flex space-x-2'>
                    <p className='text-gray-900 whitespace-no-wrap'>
                      {task.sender.replace(
                        task.sender.substring(5, task.sender.length - 4),
                        '...'
                      )}
                    </p>
                    <FaCopy
                      size={16}
                      className='cursor-pointer'
                      onClick={() => {
                        navigator.clipboard.writeText(task.sender);
                        toast('Copied to clipboard!');
                      }}
                    />
                  </div>
                </td>
                <td className='px-5 py-5 border-b border-gray-200  text-sm'>
                  <p className='text-gray-900 whitespace-no-wrap'>
                    {task.deadline}
                  </p>
                </td>
                <td className='px-5 py-5 border-b border-gray-200  text-sm'>
                  {task.status === 1 ? (
                    Date.parse(task.deadline) < Date.now() ? (
                      <button
                        type='button'
                        onClick={() => expireTask(task.id)}
                        className='py-2 px-4 text-sm bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white transition ease-in duration-200 text-center  font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
                      >
                        Expire Task
                      </button>
                    ) : (
                      <button
                        type='button'
                        onClick={() => approveTask(task.id)}
                        className='py-2 px-4 text-sm bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-purple-200 text-white transition ease-in duration-200 text-center  font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
                      >
                        Approve Task
                      </button>
                    )
                  ) : (
                    <span className='relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight'>
                      <span
                        aria-hidden='true'
                        className='absolute inset-0 bg-blue-200 opacity-50 rounded-full'
                      ></span>
                      <span className='relative'>Completed</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewerDashboard;

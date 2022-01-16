import { useState } from 'react';
import TaskDetails from './TaskDetails';
import Wallets from './Wallets';
import DurationCost from './DurationCost';
import Review from './Review';
import Success from './Success';

function NewTask({ setShowNewTask }) {
  const [task, setTask] = useState({
    title: '',
    desc: '',
    wallet_p: '',
    wallet_j: '',
    deadline: '',
    fDAI: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);
  return (
    <div>
      {currentPage === 1 && (
        <TaskDetails
          nextPage={nextPage}
          task={task}
          setTask={setTask}
          setShowNewTask={setShowNewTask}
        />
      )}

      {currentPage === 2 && (
        <Wallets
          nextPage={nextPage}
          prevPage={prevPage}
          task={task}
          setTask={setTask}
        />
      )}

      {currentPage === 3 && (
        <DurationCost
          nextPage={nextPage}
          prevPage={prevPage}
          task={task}
          setTask={setTask}
        />
      )}

      {currentPage === 4 && (
        <Review nextPage={nextPage} prevPage={prevPage} task={task} />
      )}

      {currentPage === 5 && (
        <Success
          nextPage={nextPage}
          prevPage={prevPage}
          setShowNewTask={setShowNewTask}
        />
      )}
    </div>
  );
}

export default NewTask;

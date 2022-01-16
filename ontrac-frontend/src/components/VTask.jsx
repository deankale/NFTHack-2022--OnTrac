import { useState } from 'react';
import VDetails from "./VDetails";
import VSuccess from "./VSuccess";

function Verify() {
    const [currentPage, setCurrentPage] = useState(1)
    const nextPage = () => setCurrentPage(currentPage + 1)
    const prevPage = () => setCurrentPage(currentPage - 1)
  return (
    <div>
        {currentPage === 1 && (
            <VDetails
                nextPage={nextPage} 
            />
        )}
        
        {currentPage === 2 && (
            <VSuccess 
                nextPage={nextPage}
            />
        )}
    </div>
  );
};

export default VTask;

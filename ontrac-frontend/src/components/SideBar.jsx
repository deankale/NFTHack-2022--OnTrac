import { FaTasks, FaCoins, FaEye } from 'react-icons/fa';

const SideBar = ({ setCurrentPage }) => {
  return (
    <div
      className='fixed top-16 left-0 h-screen w-16 flex flex-col
                  bg-[#e3e5e8] shadow-lg '
    >
      <Divider />
      <SideBarIcon
        icon={<FaTasks size='24' />}
        text='Doer Dashboard'
        setCurrentPage={setCurrentPage}
      />
      <SideBarIcon
        icon={<FaEye size='24' />}
        text='Viewer Dashboard'
        setCurrentPage={setCurrentPage}
      />
      <SideBarIcon
        icon={<FaCoins size='20' />}
        text='NFTs'
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

const SideBarIcon = ({ icon, text, setCurrentPage }) => (
  <div
    className='sidebar-icon group'
    onClick={() => {
      switch (text) {
        case 'Doer Dashboard':
          setCurrentPage(0);
          break;
        case 'Viewer Dashboard':
          setCurrentPage(1);
          break;
        case 'NFTs':
          setCurrentPage(2);
          break;
      }
    }}
  >
    {icon}
    <span className='sidebar-tooltip group-hover:scale-100'>{text}</span>
  </div>
);

const Divider = () => <hr className='sidebar-hr' />;

export default SideBar;

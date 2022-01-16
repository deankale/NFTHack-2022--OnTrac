import { useContext, useState } from 'react';
import BlockchainContext from './BlockchainContext';

function Header({ connectWallet }) {
  const [addr, setAddr] = useState('');
  const provider = useContext(BlockchainContext).provider;
  const signer = provider ? provider.getSigner() : null;
  if (signer) {
    signer.getAddress().then((address) => {
      setAddr(address.replace(address.substring(5, address.length - 4), '...'));
    });
  }

  return (
    <header className='flex items-center pl-4 bg-[#e3e5e8] space-x-8 fixed w-screen h-16'>
      <h1 className='text-3xl text-[#4f565f] '>OnTrac</h1>
      <button
        onClick={connectWallet}
        className={`py-2 px-4 text-md ${
          provider
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        } text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg`}
      >
        {provider ? `Wallet Connected ${addr}` : 'Connect Wallet'}
      </button>
      <span className='relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight'>
        <span
          aria-hidden='true'
          className='absolute inset-0 bg-yellow-200 opacity-50 rounded-full'
        ></span>
        <span className='relative'>Supported Chains: Rinkeby or Mumbai</span>
      </span>
    </header>
  );
}

export default Header;

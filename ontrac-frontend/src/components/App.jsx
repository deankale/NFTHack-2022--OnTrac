import React from 'react';
import DoerDashboard from './DoerDashboard';
import Header from './Header';
import SideBar from './SideBar';
import { useState, useEffect } from 'react';
import ViewerDashboard from './ViewerDashboard';
import { ethers } from 'ethers';
import WalletLink from 'walletlink';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import BlockchainContext from './BlockchainContext';
import NewTask from './NewTask';
import NFTs from './NFTs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Footer(props) {
  return <p>Copywrite {props.year}</p>;
}

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [provider, setProvider] = useState(null);
  const [showNewTask, setShowNewTask] = useState(false);

  useEffect(() => {
    const providerOptions = {
      injected: {
        display: {
          name: 'MetaMask',
          description: 'Connect to your MetaMask Wallet',
        },
        package: null,
      },
      walletconnect: {
        display: {
          name: 'WalletConnect',
        },
        package: WalletConnectProvider,
        options: {
          infuraId: 'c65ab71ad3514bfc83f58489f336b359',
        },
      },
      'custom-coinbase': {
        display: {
          logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxwYXRoIGQ9Ik0yMCA0MEMzMS4wNDU3IDQwIDQwIDMxLjA0NTcgNDAgMjBDNDAgOC45NTQzIDMxLjA0NTcgMCAyMCAwQzguOTU0MyAwIDAgOC45NTQzIDAgMjBDMCAzMS4wNDU3IDguOTU0MyA0MCAyMCA0MFoiIGZpbGw9IiMxNjUyRjAiLz4KCTxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNS40NTUwOCAyMC4wMDA2QzUuNDU1MDggMjguMDMzOCAxMS45NjczIDM0LjU0NiAyMC4wMDA2IDM0LjU0NkMyOC4wMzM4IDM0LjU0NiAzNC41NDYgMjguMDMzOCAzNC41NDYgMjAuMDAwNkMzNC41NDYgMTEuOTY3MyAyOC4wMzM4IDUuNDU1MDggMjAuMDAwNiA1LjQ1NTA4QzExLjk2NzMgNS40NTUwOCA1LjQ1NTA4IDExLjk2NzMgNS40NTUwOCAyMC4wMDA2Wk0xNy4zMTM3IDE1LjMxNDVDMTYuMjA5MSAxNS4zMTQ1IDE1LjMxMzcgMTYuMjA5OSAxNS4zMTM3IDE3LjMxNDVWMjIuNjg4MkMxNS4zMTM3IDIzLjc5MjggMTYuMjA5MSAyNC42ODgyIDE3LjMxMzcgMjQuNjg4MkgyMi42ODc0QzIzLjc5MiAyNC42ODgyIDI0LjY4NzQgMjMuNzkyOCAyNC42ODc0IDIyLjY4ODJWMTcuMzE0NUMyNC42ODc0IDE2LjIwOTkgMjMuNzkyIDE1LjMxNDUgMjIuNjg3NCAxNS4zMTQ1SDE3LjMxMzdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=',
          name: 'Coinbase Wallet',
          description: 'Connect to your Coinbase Wallet',
        },
        options: {
          appName: 'OnTrac',
          networkUrl: `https://mainnet.infura.io/v3/c65ab71ad3514bfc83f58489f336b359`,
          chainId: 1,
        },
        package: WalletLink,
        connector: async (_, options) => {
          const { appName, networkUrl, chainId } = options;
          const walletLink = new WalletLink({
            appName,
            appLogoUrl: 'https://i.imgur.com/TFif4PT.png',
          });
          const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
          await provider.enable();
          return provider;
        },
      },
    };

    setWeb3Modal(
      new Web3Modal({
        network: 'kovan',
        providerOptions,
      })
    );
  }, []);

  const connectWallet = async () => {
    if (provider) {
      if (provider.close) {
        await provider.close();
      }
      setProvider(null);
      window.location.reload();
      return;
    }

    let web3ModalProvider;
    try {
      web3ModalProvider = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(web3ModalProvider);
      setProvider(provider);
    } catch (e) {
      console.log('Could not get a wallet connection', e);
      return;
    }

    web3ModalProvider.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        setProvider(null);
        window.location.reload();
      }
    });

    web3ModalProvider.on('chainChanged', (chainId) => {
      console.log(chainId);
    });

    web3ModalProvider.on('disconnect', (error) => {
      setProvider(null);
      window.location.reload();
    });
  };

  const renderDashboard = (page) => {
    switch (page) {
      case 0:
        return <DoerDashboard setShowNewTask={setShowNewTask} />;
      case 1:
        return <ViewerDashboard />;
      case 2:
        return <NFTs />;
    }
  };
  return (
    <div>
      <BlockchainContext.Provider
        value={{ provider: provider, ethers: ethers }}
      >
        <ToastContainer />
        {!showNewTask && <SideBar setCurrentPage={setCurrentPage} />}
        <Header connectWallet={connectWallet} />
        {!showNewTask && (
          <div className='px-12 py-20 h-full'>
            {renderDashboard(currentPage)}
          </div>
        )}
        {showNewTask && (
          <div className='py-20'>
            <NewTask setShowNewTask={setShowNewTask} />
          </div>
        )}
      </BlockchainContext.Provider>
    </div>
  );
}

export default App;

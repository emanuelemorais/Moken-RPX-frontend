'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MetaMaskContext = createContext();

export function useMetaMask() {
  return useContext(MetaMaskContext);
}

export function MetaMaskProvider({ children }) {
  const [account, setAccount] = useState(null);


const checkWalletConnection = async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length > 0) {
      setAccount(accounts[0]);
      console.log('MetaMask connected:', accounts[0]);
    } else {
      console.warn('MetaMask is not connected.');
      setAccount(null);
    }
  } catch (error) {
    console.error('Error checking MetaMask connection:', error);
    setAccount(null);
  }
};

  const connectMetaMask = async () => {
    console.log('omg')
      try {
        // Request Ethereum account access from the user
        console.log('hi')
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Check if the user approved the request and accounts array is not empty
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          console.log('MetaMask connected:', accounts[0]);
        } else {
          console.warn('User denied MetaMask account access.');
          setAccount(null);
        }
      } catch (error) {
        console.error('MetaMask connection error:', error);
        setAccount(null);
      }
    }


  useEffect(() => {
    // Check the wallet connection when the component mounts
    checkWalletConnection();
  }, []); 
  

  const value = {
    account,
    connectMetaMask,
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
}
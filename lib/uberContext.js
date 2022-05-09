import { createContext, useState, useEffect } from 'react'

import {ethers} from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const UberContext = createContext()




const getEthereumContract = () => {
   const provider = new ethers.providers.web3provider(ethereum)
   const signer = provider.getSigner();
   const transactionContract =new ethers.Contract(contractAddress, contractABI, signer);

   console.log({

    provider,
    signer,
    transactionContract,

});

   
}





export const UberProvider = ({ children }) => {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [pickupCoordinates, setPickupCoordinates] = useState()
  const [dropoffCoordinates, setDropoffCoordinates] = useState()
  const [currentAccount, setCurrentAccount] = useState("");
  
  useEffect(() => {
    if (pickup && dropoff) {
        ;(async () => { 
            await Promise.all([
                createLocationCoordinatePromise(pickup,'pickup'),
                createLocationCoordinatePromise(dropoff, 'dropoff')
            ])
        })()
    } else return
  }, [pickup,dropoff])

    
  const createLocationCoordinatePromise = (locationName, locationType) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('api/map/getLocationCoordinates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location: locationName,
          }),
        })

        const data = await response.json()

        if (data.message === 'success') {
          switch (locationType) {
            case 'pickup':
              setPickupCoordinates(data.data)
              break
            case 'dropoff':
              setDropoffCoordinates(data.data)
              break
          }
          resolve()
        } else {
          reject()
        }
      } catch (error) {
        console.error(error)
        reject()
      }
    })
  }
  
  
  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        //getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  
  useEffect(() => {
    checkIfWalletIsConnect();
    
  },[]);
  return (
        <UberContext.Provider value ={{pickup,
            setPickup,
            dropoff,
            setDropoff,
            pickupCoordinates,
            setPickupCoordinates,
            dropoffCoordinates,
            setDropoffCoordinates,
            currentAccount,
            connectWallet,}}>{children}</UberContext.Provider>
    )

}
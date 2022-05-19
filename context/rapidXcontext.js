import { createContext, useState, useEffect } from 'react';
import { faker } from '@faker-js/faker'
import {ethers} from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const RapidXContext = createContext()

//let metamask

if (typeof window !== 'undefined') {
    
    const{ethereum}=window;
  }

const createEthereumContract = () => {
   const provider = new ethers.providers.Web3Provider(ethereum)
   const signer = provider.getSigner();
   const transactionContract =new ethers.Contract(contractAddress, contractABI, signer);

   return transactionContract;

   
}





export const RapidXProvider = ({ children }) => {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [pickupCoordinates, setPickupCoordinates] = useState()
  const [dropoffCoordinates, setDropoffCoordinates] = useState()
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentUser, setCurrentUser] = useState([])
  const [selectedRide, setSelectedRide] = useState([])
  const [price, setPrice] = useState()
  const [basePrice, setBasePrice] = useState()
  const [isLoading, setIsLoading] = useState(false);
  //const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
  const [transactions, setTransactions] = useState([]);
  
  
  
  
  
  
  useEffect(() => {
    if (!currentAccount) return
    requestToGetCurrentUsersInfo(currentAccount)
  }, [currentAccount])

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
  
  
  useEffect(() => {
    if (!pickupCoordinates || !dropoffCoordinates) return
    ;(async () => {
      try {
        const response = await fetch('/api/map/getDuration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pickupCoordinates: `${pickupCoordinates[0]},${pickupCoordinates[1]}`,
            dropoffCoordinates: `${dropoffCoordinates[0]},${dropoffCoordinates[1]}`,
          }),
        })

        const data = await response.json()
        setBasePrice(Math.round(await data.data))
      } catch (error) {
        console.error(error)
      }
    })()
  }, [pickupCoordinates, dropoffCoordinates])

  const requestToGetCurrentUsersInfo = async walletAddress => {
    try {
      const response = await fetch(
        `/api/db/getUserInfo?walletAddress=${walletAddress}`,
      )

      const data = await response.json()
      setCurrentUser(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const requestToCreateUserOnSanity = async address => {
    if (!window.ethereum) return
    try {
      await fetch('api/db/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userWalletAddress: address,
          name: faker.name.findName(),
        }),
      })
    } catch (error) {
      console.error(error)
    }
  }
  
  const checkIfWalletIsConnect = async () => {
    if (!ethereum) return
    try {
      const addressArray = await ethereum.request({
        method: 'eth_accounts',
      })

      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0])
        requestToCreateUserOnSanity(addressArray[0])
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  const connectWallet = async () => {
    if (!ethereum) return
    try {
      const addressArray = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0])
        requestToCreateUserOnSanity(addressArray[0])
      }
    } catch (error) {
      console.error(error)
    }
  };
  
  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, []);
 
  
  
  
  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const addressTo=contractAddress;
        const amount=price;
        const keyword='transaction';
        const message = 'successful';
        const transactionContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount)._hex;
        console.log(amount);
        
        await ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: '0x5208',
            value: parsedAmount,
          }],
        });
        const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  
  const checkIfTransactionsExists = async () => {
    try {
      if (window.ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      //throw new Error("No ethereum object");
    }
  };
  
  return (
        <RapidXContext.Provider value ={{pickup,
            setPickup,
            dropoff,
            setDropoff,
            pickupCoordinates,
            setPickupCoordinates,
            dropoffCoordinates,
            setDropoffCoordinates,
            setSelectedRide,
            selectedRide,
            currentAccount,
            currentUser,
            connectWallet,
            price,
            setPrice,
            sendTransaction,
            //transactionCount,
            isLoading,
            basePrice,}}>{children}</RapidXContext.Provider>
    )

}
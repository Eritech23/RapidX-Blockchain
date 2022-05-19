import React from 'react'
import RideSelector from './RideSelector'
import { useContext } from 'react'
import { RapidXContext } from '../context/rapidXcontext'
import {ethers} from 'ethers';





const style ={
    wrapper: `flex-1 h-full flex flex-col justify-between`,
    rideSelectorContainer: `h-full flex flex-col overflow-scroll`,
    confirmButtonContainer: ` border-t-2 cursor-pointer z-10`,
    confirmButton: `bg-black text-white m-4 py-4 text-center text-xl`,
}

const  Confirm = ()=> {
 const{ 
  
  currentAccount,
  connectWallet,
  sendTransaction,
  formData,
  pickup,
  dropoff,
  price,
  selectedRide,
  pickupCoordinates,
  dropoffCoordinates,
  metamask,
} = useContext(RapidXContext)





const storeTripDetails = async (pickup, dropoff) => {
  try {
    await fetch('/api/db/saveTrips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        userWalletAddress: currentAccount,
        price: price,
        selectedRide: selectedRide,
      }),
    })

    //sendTransaction()

} catch (error) {
  console.error(error)
}
}




   


  return (
    <div className={style.wrapper}>
      <div className={style.rideSelectorContainer}>
      {pickupCoordinates && dropoffCoordinates && <RideSelector />}
      </div>
      <div className={style.confirmButtonContainer}>
        <div className={style.confirmButtonContainer}>
          <div
            className={style.confirmButton}
            onClick={() => storeTripDetails(pickup, dropoff)   && sendTransaction() }
          >
            Confirm{selectedRide.service || ' RapidX'}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Confirm
import React from 'react'
import ethLogo from '../assets/eth-logo.png'
import uberBlack from '../assets/cars/uberBlack.png'
import uberXwhite from '../assets/cars/uberXwhite.png'
import Image from 'next/image'
import { useEffect, useContext, useState } from 'react'
import { UberContext } from '../lib/uberContext'


const style = {
    
  wrapper: `h-full flex flex-col`,
  title: `text-gray-500 text-center text-xs py-2 border-b`,
  carList: `flex flex-col flex-1 overflow-scroll`,
  car: `flex p-3 m-2 items-center border-2 border-white`,
  selectedCar: `border-2 border-black flex p-3 m-2 items-center`,
  carImage: `h-14`,
  carDetails: `ml-2 flex-1`,
  service: `font-medium`,
  time: `text-xs text-blue-500`,
  priceContainer: `flex items-center`,
  price: `mr-[-0.8rem]`,
  }
  


const basePrice=1542

const carList = [
{
  service: 'UberX',
  iconUrl: uberXwhite,
  priceMultiplier: 1

},
{
    service: 'UberBlack',
    iconUrl: uberBlack,
    priceMultiplier: 1.5
  
  }


]
const RideSelector = () => {
  
  
    return (
         <div className = {style.wrapper}>
         <div className ={style.title}> choose a ride, or swipe up for more</div>
             <div className ={style.carList}>
            {carList.map((car,index) => (
             <div  key={index} className={style.car}>
                <Image
                  src={car.iconUrl}
                  className={style.carImage}
                  height={50}
                  width={50}
                  />
                  <div className={style.carDetails}>
                     <div className={style.service}>{car.service}</div>
                    <div className={style.time}> 5 min away</div>
                </div>
                  <div className={style.priceContainer}>
                      <div className={style.price}></div>
                      {((basePrice/10 ** 5) * car.priceMultiplier).toFixed(5)}
                 </div>
                 <Image src={ethLogo} height={25} width={40} />
                 </div>
             ))}
          </div>
        </div>

  )
}

export default RideSelector
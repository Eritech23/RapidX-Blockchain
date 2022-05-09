import React from 'react'
import Image from 'next/image'
import avatar from '../temp/avatar.jpg'
import { BsPerson } from 'react-icons/bs'
import { useContext } from 'react'
import { UberContext } from '../lib/uberContext'

const style = {
        wrapper:`h-16 w-full bg-black text-white flex md:justify-around items-center px-60 fixed z-20`,
        leftMenu: `flex gap-3`,
        logo: `text-3xl text-white flex cursor-pointer mr-16`,
        menuItem: `text-lg text-white font-medium flex items-center mx-4 cursor-pointer`,
       rightMenu: `flex gap-3 items-center`,
       userImageContainer: `mr-2`,
       userImage: `h-10 w-10 mr-4 rounded-full p-px object-cover cursor-pointer`,
      loginButton: `bg-[#2952e3] py-1 px-4 mx-3 rounded-full cursor-pointer hover:bg-[#2546bd]`,
     loginText: `ml-2`,
    
}

//const currentAccount ='0x5D3032B0c12dce515b4d9383F2A5cbDC63A796A7'


const Navbar = () => {

  const { currentAccount, connectWallet } = useContext(UberContext)
  return( 
    <div className={style.wrapper}>
      <div className={style.leftMenu}>
        <div className={style.logo}>RapidX</div>
        <div className={style.menuItem}>Pay with crypto</div>
        
      </div>
      <div className={style.rightMenu}>
        <div className={style.menuItem}>Help</div>
        <div className={style.menuItem}>Eriksson</div>
        <div className={style.userImageContainer}>
          <Image
            className={style.userImage}
            src={avatar}
            width={40}
            height={40}
          />
        </div>
        {currentAccount ? (
          <div>
            {currentAccount.slice(0, 6)}...{currentAccount.slice(39)}
          </div>
        ) : (
          <div className={style.loginButton} onClick={() => connectWallet()}>
            <BsPerson />
            <span className={style.loginText}>Connect wallet</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
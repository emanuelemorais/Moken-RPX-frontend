'use client'
import Image from 'next/image'
import Link from 'next/link';
import { useMetaMask } from '../contexts/WalletContext';
import CopyToClip from './CopyToClip';
import Modal from '../components/Modal';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { account, connectMetaMask } = useMetaMask();
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    connectMetaMask()
  }, [account]);

  return (
    <div>
    <Modal
        closeModal={() => setModalOpened(false)}
        opened={modalOpened}
       />
    <div className='flex justify-center'>
      <div className='m-4 md:m-6 bg-white w-full md:w-[90%] lg:w-[80%] h-16 rounded-md shadow-md flex md:flex-row justify-between p-4'>
        <div className='flex gap-4 md:gap-16 items-center'>
          <Link href="/" className='hover:scale-95 duration-300'>
            <Image
              src='/moken.svg'
              alt='Moken Logo' justify
              width={70}
              height={100}
            />
          </Link>
        </div>

        <button onClick={() => setModalOpened(true)}>
          <Image src='/Menu.svg' alt='Menu' width={25} height={25} />
        </button>

      </div>
    </div>
 </div>
  );
}

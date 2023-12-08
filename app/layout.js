'use client'
import './globals.css'
import React from 'react';
import { Montserrat } from 'next/font/google'
import { MetaMaskProvider } from '../contexts/WalletContext';
import { ModalProvider } from '@/contexts/modal';
import "./globals.css";
import { SelectedRentalProvider } from "../contexts/rental";


const montserrat = Montserrat({subsets: ['latin']})

export default function RootLayout({ children }) {

  return (
    <html className={montserrat.className}>
      <SelectedRentalProvider>
      <MetaMaskProvider>
      <ModalProvider >
      <body className='bg-lightGray w-full'>
            {children}
      </body>
      </ModalProvider>
      </MetaMaskProvider>
      </SelectedRentalProvider>
    </html >
  )
}

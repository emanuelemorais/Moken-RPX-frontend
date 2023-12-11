"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useQRCode } from "next-qrcode";
import { useMetaMask } from "@/contexts/WalletContext";

const page = () => {
  const { Canvas } = useQRCode();
  const { account, connectMetaMask } = useMetaMask();
  console.log(account);
  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex flex-col justify-center items-center mx-6 md:mx-36 gap-2 mt-24">
        <h1 className="font-bold text-2xl">Your Key</h1>
        <p className="mb-4">
          Use this QR Code to open the door to your rented property.
        </p>

        <Canvas
          text={account || "0x000000"}
          options={{
            errorCorrectionLevel: "M",
            margin: 3,
            scale: 4,
            width: 200,
            color: {
              dark: "#000",
              light: "#FFF",
            },
          }}
        />
      </div>
    </div>
  );
};

export default page;

"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import Moken from "@/abi/Moken.json";
import Property from "@/abi/Property.json";
import { ethers } from "ethers";
import axios from "axios";
import ImageUploader from "@/components/ImageUploader";
import dotenv from "dotenv";
dotenv.config();


export default function Rentals() {
  const [imageData, setImageData] = useState(null);
  const [cid, ]

  const uploadFile = async (imageData) => {
    try {
      const formData = new FormData();
  
      formData.append("file", imageData);
  
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      });
      const json = await res.json();
      console.log(json);
      const { IpfsHash } = json;
    } catch (e) {
      console.log(e);
      alert("Trouble uploading file");
    }
  };
  
  const pinJson = () => {
  
    const json = {
      "type": "House",
      "address": "456 Oak Avenue",
      "bedrooms": 4,
      "size": 250,
      "image": "https://ipfs.io/ipfs/QmfZpAZzMNLYEq5ApRcNH1czrK6xYeeBPg7qEtTd4mtF1X/1.jpg"
    }
  };

  const handleImageUpload = (dataUrl) => {
    // Convert data URL to Blob
    const base64String = dataUrl.split(",")[1];
    const mimeType = dataUrl.split(";")[0].slice(5);
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: mimeType });

    // Set the image data state
    setImageData(blob);
  };

  const save = async () => {
    uploadFile(imageData);
  };
  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col justify-center items-center mx-6 md:mx-36 my-8 md:my-16">
        <div className="px-6 ">
          <span className="flex justify-between items-center">
            <h1 className="mx-8 my-4 font-bold text-3xl pb-8">
              Adicionar propriedade
            </h1>
          </span>
          <ImageUploader onImageUpload={handleImageUpload} />
          {imageData && (
            <img src={imageData} alt="Uploaded" className="mt-4 max-w-full" />
          )}
        </div>
        <button onClick={save}>Adicionar</button>
      </div>
    </div>
  );
}

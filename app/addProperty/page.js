"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import Moken from "@/abi/Moken.json";
import Property from "@/abi/Property.json";
import { ethers } from "ethers";
import axios from "axios";
import ImageUploader from "@/components/ImageUploader";
import dotenv from "dotenv";
import { useMetaMask } from "@/contexts/WalletContext";
dotenv.config();

export default function Rentals() {
  const [displayImage, setDisplayImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [cid, setCid] = useState("");
  const [finalCid, setFinalCid] = useState("");
  const { account, connectMetaMask } = useMetaMask();
  const [price, setPrice] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Add feedback message state


  const [propertyData, setPropertyData] = useState({
    type: "House", // Default to 'House'
    address: "",
    bedrooms: 0,
    size: 0,
  });
  const [propertyContract, setPropertyContract] = useState(null);

  useEffect(() => {
    const InitializePropertiesContract = async () => {
      const contractAddress = "0x330D0349ed3c5A8a212CC15EeBA92A6b4807dDF4";
      const contractABI = Moken.abi;
      let provider = new ethers.BrowserProvider(window.ethereum);
      let signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("contract", contract);
      setPropertyContract(contract);

      return contract;
    };

    InitializePropertiesContract();
  }, []);

  const uploadFile = async (imageData) => {
    try {
      const formData = new FormData();

      formData.append("file", imageData);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const json = await res.json();
      const { IpfsHash } = json;
      console.log('my ipfs:  ' + IpfsHash)
      await pinJson(IpfsHash)

    } catch (e) {
      console.log(e);
      alert("Trouble uploading file");
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name == "bedrooms" || name == "size") {
      value = parseInt(value);
    }

    setPropertyData((prevData) => ({ ...prevData, [name]: value }));
  };

  const pinJson = async (ipfs) => {
    console.log("pinning now")
    let data = propertyData;
    data.image = `https://ipfs.io/ipfs/${ipfs}`;
    console.log('data to be pinned: ' + JSON.stringify(data))

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    console.log('json: ' + JSON.stringify(json))
    const response = await propertyContract.newProperty("name", "symbol", `https://ipfs.io/ipfs/${json.IpfsHash}`, price, account);
    console.log(response)
    console.log('new property created')
    setFeedbackMessage("Property added successfully!");

      // Clear the feedback message after a delay (e.g., 5 seconds)
      setTimeout(() => {
        setFeedbackMessage("");
      }, 5000);
  };

  const handleImageUpload = (dataUrl) => {
    setDisplayImage(dataUrl);
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
    await uploadFile(imageData);
    console.log('got the cid: ' + cid)

    
  };
  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col justify-center items-center mx-6 md:mx-36 my-8 md:my-16">
        <div className="">
          <span className="flex justify-between items-center">
            <h1 className=" my-4 font-bold text-3xl pb-8">
              Add property
            </h1>
          </span>
          {/* Input fields for property details */}
          <div className="my-4">
            <label htmlFor="type" className="mr-2">
              Type:
            </label>
            <select
              id="type"
              name="type"
              value={propertyData.type}
              onChange={handleInputChange}
            >
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Hostel">Hostel</option>
            </select>
          </div>
          <div className="my-4">
            <label htmlFor="address" className="mr-2">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={propertyData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="my-4">
            <label htmlFor="bedrooms" className="mr-2">
              Bedrooms:
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={propertyData.bedrooms}
              onChange={handleInputChange}
            />
          </div>
          <div className="my-4">
            <label htmlFor="size" className="mr-2">
              Size:
            </label>
            <input
              type="number"
              id="size"
              name="size"
              value={propertyData.size}
              onChange={handleInputChange}
            />
          </div>
          <div className="my-4">
            <label htmlFor="size" className="mr-2">
              Price:
            </label>
            <input
              type="number"
              id="size"
              name="size"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <ImageUploader onImageUpload={handleImageUpload} />
          {displayImage && (
            <img
              src={displayImage}
              alt="Uploaded"
              className="mt-4 max-w-full"
            />
          )}
        </div>
        <button className='bg-black text-white font-bold text-xl my-4 md:my-8 p-4 md:p-6 rounded-2xl hover:scale-95 duration-300' onClick={save}>Add</button>
      </div>
    </div>
  );
}

'use client'

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useSelectedRental } from "../../contexts/rental";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import Property from "@/abi/Property.json";

export default function BuyProperty() {
  const { setSelectedRental, selectedRental } = useSelectedRental();
  const [contract, setContract] = useState(null);
  const router = useRouter();
  const [date, setDate] = useState("");
  const [feedback, setFeedback] = useState(""); // State for feedback message

  useEffect(() => {
    const initialize = async () => {
      const contractAddress = selectedRental?.contract;
      console.log("contractAddress", contractAddress);
      const contractABI = Property.abi;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const propertyContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setContract(propertyContract);
    };
    initialize();
    if (selectedRental == null) {
      console.log("selectedRental is null");
      router.push("/");
    }

    console.log("selectedRental", selectedRental);
  }, [selectedRental]);

  const buy = async () => {
    try {
      const date_obj = new Date(date);
      const day_of_the_year = Math.floor(
        (date_obj - new Date(date_obj.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
      );
      const result = await contract.booking(day_of_the_year);
      if (result) {
        // Booking was successful
        setFeedback("Your booking was successful");
      } else {
        // Booking failed (date already booked)
        setFeedback("This date is already booked");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle other errors if needed
      setFeedback("This date is already booked");
    }
  };

  return (
    <div >
      <Navbar />
      <div className="flex flex-col justify-center items-center mx-6 md:mx-36 my-8 md:my-16">
        <h1 className="font-bold text-2xl">
          Purchase property access token
        </h1>
        {/* Display feedback message if available */}
        {feedback && (
          <div className={feedback === "Your booking was successful" ? "text-green-500 ml-16" : "text-red-500 ml-16"}>
            {feedback}
          </div>
        )}
        <div className="flex justify-between mt-8 mx-6">
          <div className="">
            <div className="">
              <p className="font-semibold text-xl">Date</p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-80 py-2 px-1 rounded-lg border border-black hover:cursor-pointer"
              />
            </div>
            <div className="mt-8 ml-4">
              <h1 className="text-2xl font-bold">
                Price: <span className="text-green-500">${selectedRental?.price}</span>
              </h1>
            </div>
            <button
              className="py-4 w-80 rounded-md font-bold mt-12 bg-black text-white hover:scale-95 duration-300"
              onClick={buy}
            >
              Buy token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

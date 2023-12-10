"use client";

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
  const [feedback, setFeedback] = useState(""); // State for feedback message
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      const start_date_obj = new Date(startDate);
      const end_date_obj = new Date(endDate);

      // Check if start date is before end date
      if (start_date_obj >= end_date_obj) {
        setFeedback("Invalid date range");
        return;
      }

      const start_day_of_the_year = Math.floor(
        (start_date_obj - new Date(start_date_obj.getFullYear(), 0, 0)) /
          1000 /
          60 /
          60 /
          24
      );

      console.log("start_day_of_the_year", start_day_of_the_year);

      const end_day_of_the_year = Math.floor(
        (end_date_obj - new Date(end_date_obj.getFullYear(), 0, 0)) /
          1000 /
          60 /
          60 /
          24
      );

      console.log("end_day_of_the_year", end_day_of_the_year);
      console.log("selectedRental?.price", selectedRental?.price);
      console.log(
        ethers.formatEther(
          (selectedRental?.price * (end_day_of_the_year - start_day_of_the_year + 1)).toString()))
      // Call the contract method for each day in the range
      const result = await contract.booking(
        start_day_of_the_year,
        end_day_of_the_year,
        {
          value:  (selectedRental?.price * (end_day_of_the_year - start_day_of_the_year + 1)).toString()
          
        }
      );
      if (!result) {
        // If any day is already booked, show error and break
        setFeedback("Some dates in the range are already booked");
        return;
      }

      // If all days are available, set feedback as successful
      setFeedback("Your booking was successful");
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle other errors if needed
      setFeedback("An error occurred");
    }
  };
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center mx-6 md:mx-36 my-8 md:my-16">
        <h1 className="font-bold text-2xl">Purchase property access token</h1>
        {/* Display feedback message if available */}
        {feedback && (
          <div
            className={
              feedback === "Your booking was successful"
                ? "text-green-500 ml-16"
                : "text-red-500 ml-16"
            }
          >
            {feedback}
          </div>
        )}
        <div className="flex justify-between mt-8 mx-6">
          <div className="">
            <div className="">
              <p className="font-semibold text-xl">Start Date</p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-80 py-2 px-1 rounded-lg border border-black hover:cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <p className="font-semibold text-xl">End Date</p>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 w-80 py-2 px-1 rounded-lg border border-black hover:cursor-pointer"
              />
            </div>
            <div className="mt-8 ml-4">
              <h1 className="text-2xl font-bold">
                Price:{" "}
                <span className="text-green-500">${selectedRental?.price}</span>
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

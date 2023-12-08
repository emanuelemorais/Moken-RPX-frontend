'use client'

import Navbar from "@/components/Navbar";
import SearchField from "@/components/SearchField";
import CardList from "@/components/CardList";
import { useState, useEffect } from "react";
import Moken from "@/abi/Moken.json";
import Property from "@/abi/Property.json";
import { ethers } from "ethers";

export default function Rentals() {
  const [rentals, setRentals] = useState([]); // useState for storing all rental data
  const [filteredRentals, setFilteredRentals] = useState([]); // useState for storing filtered rental data
  const [searchTerm, setSearchTerm] = useState(''); // useState for storing search term
  const [propertyContract, setPropertyContract] = useState(null);
  const [propertyAddress, setPropertyAddress] = useState(null);
  const [updated, setUpdated] = useState(false);



  var provider = null
  var signer = null

  useEffect(() => {
    const fetchURIJson = async (uri) => {
      const response = await fetch(uri);
      const json = await response.json();
      return json;
    }


    const InitializePropertiesContract = async () => {
      const contractAddress = "0x3C7A6F47E3499419Fe889072a6B8CF3A4F9a6D92";
      const contractABI = Moken.abi;
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("contract", contract);
      setPropertyContract(contract);

      return contract;
    };

    const fetchRental = async () => {
      try {
        console.log("fetching rentals");

        const property_contract = await InitializePropertiesContract();
        console.log("initialized properties contract");

        const properties = await property_contract.getAllProperties();
        console.log("got all properties");

        let id = 0;
        const rentalData = await Promise.all(properties.map(async (address) => {
          console.log("fetching property data for address", address);
          const contract = new ethers.Contract(address, Property.abi, signer);
          console.log("initialized property contract");

          const propertyData = await contract.property();
          const struct_property_data = {...propertyData};
          console.log("got property data", struct_property_data);
          const uri = struct_property_data[0];
          const json = await fetchURIJson(uri);
          return {
            address: json["address"],
            contract: address,
            id: id++,
            type: json["type"],
            price: struct_property_data[2].toString(),
            bedrooms: json["bedrooms"],
            size: json["size"],
            image: json["image"],
          }
        }));
        setRentals(rentalData);
        console.log(rentalData);
        setFilteredRentals(rentalData);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };

    if (updated === false) {
      fetchRental();

      setUpdated(true);
    }
  }, [propertyContract, rentals, updated]);

   const onSearch = (searchTerm) => {
     setSearchTerm(searchTerm);
     filterRentals(searchTerm);
   };

   const filterRentals = (searchTerm) => {
     const filtered = rentals.filter((blockchainRental) => {
       const rentalValues = Object.values(blockchainRental).map((value) =>
         typeof value === 'string' ? value.toLowerCase() : value
       );

       return rentalValues.some((value) =>
         String(value).includes(searchTerm.toLowerCase())
       );
     });

     setFilteredRentals(filtered);
   };

   const resetFilter = () => {
     setFilteredRentals(rentals);
     setSearchTerm('');
   };

  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col justify-center items-center mx-6 md:mx-36 my-8 md:my-16">
      <div className="px-6 ">
        <span className="flex justify-between items-center">
          <h1 className="mx-8 my-4 font-bold text-3xl pb-8">All rentals</h1>

          <SearchField onSearch={onSearch} onBlur={resetFilter} />
        </span>
        <CardList filteredRentals={filteredRentals} />
      </div>
      </div>
    </div>
  );
}

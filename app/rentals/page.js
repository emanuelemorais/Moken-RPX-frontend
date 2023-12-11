"use client";

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
  const [searchTerm, setSearchTerm] = useState(""); // useState for storing search term
  const [propertyContract, setPropertyContract] = useState(null);
  const [propertyAddress, setPropertyAddress] = useState(null);
  const [updated, setUpdated] = useState(false);

  var provider = null;
  var signer = null;

  const fetchURIJson = async (uri) => {
    try {
      console.log("fetching json for uri", uri);
      if (
        uri ===
          `https://ipfs.io/ipfs/"https://ipfs.io/ipfs/QmNhU3rSkUePaABwqUWxgcowK1G52pPnxNzU7nGyYkEgac` ||
        uri === "https://ipfs.io/ipfs/" ||
        uri ===
          "https://ipfs.io/ipfs/QmcfQx3Re3thVLHLfQC3umM6jBfQbpohmGkPmFDDUXfkUh"
      ) {
        console.warn(`Skipping rental for URI ${uri} due to empty URI`);
        return null;
      }
      const response = await fetch(uri);

      if (response.status === 422) {
        console.warn(
          `Skipping rental for URI ${uri} due to 422 Unprocessable Entity`
        );
        return null;
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error(`Error fetching JSON for URI ${uri}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const InitializePropertiesContract = async () => {
      const contractAddress = "0x330D0349ed3c5A8a212CC15EeBA92A6b4807dDF4";
      const contractABI = Moken.abi;
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      setPropertyContract(contract);

      return contract;
    };

    const fetchRental = async () => {
      try {
        const property_contract = await InitializePropertiesContract();

        let properties = await property_contract.getAllProperties();

        let itemsToRemove = ['0x3c7828F277000DFFa2876b997Edb4c2f92E2c40b', '0xb8eBf3aa6c7fbbbbE7ED74464BFe7C03fa62895E', '0xD808867510D8B5EE4a4EB52a3F5e8B94f1b71Be6', '0x6985bF2D27060D9eb635529935d32C2Db5b5E024'];

        properties = properties.filter(
          (item) => !itemsToRemove.includes(item)
        );

        let id = 0;
        const rentalData = await Promise.all(
          properties.map(async (address) => {
            console.log("fetching property data for address", address);
            const contract = new ethers.Contract(address, Property.abi, signer);
            const propertyData = await contract.property();
            const struct_property_data = { ...propertyData };
            console.log("got property data", struct_property_data);
            const uri = struct_property_data[0];
            const json = await fetchURIJson(uri);
            if (json === null) {
              // Skip this rental
              return null;
            }
            return {
              address: json["address"],
              contract: address,
              id: id++,
              type: json["type"],
              price: struct_property_data[2].toString(),
              bedrooms: json["bedrooms"],
              size: json["size"],
              image: json["image"],
            };
          })
        );
        setRentals(rentalData);
        console.log(rentalData);
        setFilteredRentals(rentalData);
      } catch (error) {
        console.error("Error fetching rentals:", error);
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
        typeof value === "string" ? value.toLowerCase() : value
      );

      return rentalValues.some((value) =>
        String(value).includes(searchTerm.toLowerCase())
      );
    });

    setFilteredRentals(filtered);
  };

  const resetFilter = () => {
    setFilteredRentals(rentals);
    setSearchTerm("");
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

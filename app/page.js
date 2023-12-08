'use client'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import CardProperty from '@/components/CardProperty'
import { useEffect, useState } from 'react';
import Moken from '@/abi/Moken.json';
import { ethers } from "ethers";
import Property from '@/abi/Property.json';
import Card from '@/components/Card';

export default function Home() {
  const router = useRouter();
  const [propertyContract, setPropertyContract] = useState(null);
  const [rentals, setRentals] = useState([]); // useState for storing all rental data
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

  return (
    <div>
      <Navbar />
      <div className='flex flex-col justify-center items-center mx-4 md:mx-36 my-8 md:my-16'>
        <div className='mx-4'>
          <Image
            src={'/Illustration.svg'}
            alt='Illustration'
            width={550}
            height={550}
          />
        </div>

        <div className='w-full md:w-[50%] flex flex-col justify-center items-center mt-8'>
          <p className='text-2xl md:w-[70%] mt-6 text-center font-bold'>Your travel, your rules</p>
          <p className='text-md mt-6 text-center mx-4'>
            Welcome to the future of travel with Moken powered by blockchain technology. Say goodbye to traditional booking platforms and embrace a new era of secure, transparent, and efficient home sharing.
          </p>
        </div>
      </div>

      <div className='mx-8'>
        <p className='text-xl font-bold text-center'>Recommendations for you</p>
        <div className="flex overflow-x-auto space-x-8 w-full my-4 sm:justify-start lg:justify-center" id="image-slider">
        {rentals.map((rental) => (
        <CardProperty
          key={rental?.id} // Make sure to set a unique key for each Card component
          type={rental?.type}
          price={rental?.price}
          address={rental?.address}
          bedrooms={rental?.bedrooms}
          size={rental?.size}
          spots={rental?.spots}
          image={rental?.image}
        />
      ))}

        </div>
      </div>


      <div className='w-full min-h-fit flex flex-col md:flex-row justify-evenly p-6 md:p-12'>

        <div className='w-full md:w-1/2 flex flex-col justify-center items-center'>
          <h1 className='font-bold text-2xl my-2'>Find your property</h1>
          <p>Unlocking the Future of Travel: Where Keys Meet Innovation </p>
          <button onClick={() => router.push('/rentals')} className='bg-black text-white font-bold text-xl my-4 md:my-8 p-4 md:p-6 rounded-2xl hover:scale-95 duration-300'>See available options</button>
        </div>
      </div>
    </div>
  )
}

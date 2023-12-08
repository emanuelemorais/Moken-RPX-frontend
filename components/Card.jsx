// Card.js
import Image from 'next/image';
import { useSelectedRental } from '../contexts/rental';
import { useRouter } from 'next/navigation';


const Card = ({ price, address, size, bedrooms, type, image, contract}) => {
  const { setSelectedRental } = useSelectedRental();
  const router = useRouter();

  const handleCardClick = () => {
    // Set the selected rental when the card is clicked
    setSelectedRental({
      type,
      price,
      address,
      bedrooms,
      size,
      contract
    });

    router.push('/buyProperty');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address).then(() => {
      console.log("Address copied to clipboard");
    });
  };


  return (
    <div
      className="border rounded-md py-6 w-full bg-white border-black hover:cursor-pointer hover:scale-[98%] duration-300"
      onClick={handleCardClick}
    >
      <img src={image} className="w-full" width={200} height={200} alt={type} />
      <div className="px-4 pt-4 gap-2 flex flex-col">
        <p className="text-gray-500 text-xs">{type}</p>
        <p className="font-semibold">Starting at <span className="text-green-500">${price}</span>/day</p>
        <div className="flex items-center text-xs">
          <span className="text-yellow-600">{address}</span>
          <button onClick={copyToClipboard} className="ml-2">
            <Image src="/papeis.png" width={16} height={16} alt="Copy" />
          </button>
        </div>
        <p className="text-xs text-blue-800">
          {size} m² • {bedrooms} bedrooms
        </p>
      </div>
    </div>
  );
};

export default Card;

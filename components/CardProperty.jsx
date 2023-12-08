import Image from 'next/image';

const CardProperty = ({ price, address, size, bedrooms, type, image }) => {

  return (
    <div className="flex-shrink-0" style={{ width: "250px" }}>
            <button className='bg-white border-2 border-black rounded-2xl w-full'>

              <div className="p-2 flex flex-row justify-between items-center">

              </div>
              <img src={image} className="w-full" width={300} height={300} alt={type} />

              <div className="p-4 text-start">
                <p className="text-sm text-gray-600">{type}</p>
                <p className="text-md mb-4">
                Starting at:{" "}
                  <span className="text-xl font-bold text-green-500">${price}</span>
                </p>

                <p className="text-gray-700 font-bold mb-4 text-yellow-600">
                  {address}
                </p>

                <p className="text-md mb-2 text-blue-800">
                  {size} m² • {bedrooms} bedrooms
                </p>


                <p className="italic font-bold text-sm"></p>
              </div>
            </button>
          </div>

  );
};

export default CardProperty;

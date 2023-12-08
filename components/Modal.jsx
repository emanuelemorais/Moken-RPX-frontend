import Link from "next/link";

import Image from "next/image";
import { useMetaMask } from '../contexts/WalletContext';


const Modal = ({ opened, closeModal }) => {
    const { account } = useMetaMask();



    return opened ? (
        <div className="z-100 fixed bg-white flex flex-1 flex-col items-center w-full min-h-screen h-full py-8 px-4">
            <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
                <div className="w-11/12 flex flex-row justify-between mb-24">
                    <button onClick={closeModal}>
                        <Image 
                            src='./closeIcon.svg'
                            width={24}
                            height={24}
                            alt='Close icon'
                        />
                    </button>
                </div>

                <div className="flex flex-col w-7/12 transform hover:scale-105 transition duration-300 ease-in-out px-4">
                        <div className="py-2 px-4 flex flex-row justify-between items-center rounded-t-2xl border-2 border-black border-b-0 w-full shadow-xl">
                        </div>
                        <div className="border-t-none border-2 border-black rounded-b-2xl flex flex-col flex-1 justify-center items-center px-2 py-8 shadow-xl">
                            <div
                                className="h-[3rem] w-[3rem] mb-8 bg-black rounded-full border-0 border-gray-600"
                            ></div>

                            <p
                                className="w-full underline text-md font-semibold text-center"
                                
                            >
                                {account.substring(0, 6) + "..." + account.substring(37, 42)}
                            </p>

                        </div>
                    </div>


                <div className="w-full flex flex-col items-center">
                    <Link
                        href={"/"}
                        className="w-4/5 border-2 border-black rounded-3xl px-4 py-2 flex flex-row justify-between mt-16 items-center shadow-lg transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-105 duration-200"
                        onClick={closeModal}
                    >
                        <div className="flex flex-row items-center" >
                            <p className="font-semibold text-xl ml-2">
                                Home
                            </p>
                        </div>
                        <Image 
                            src='./arrow1.svg'
                            width={24}
                            height={24}
                            alt='Arrow'
                        />

                    </Link>
                    <Link
                        href={"/rentals"}
                        className="w-4/5 border-2 border-black rounded-3xl px-4 py-2 flex flex-row justify-between mt-16 items-center shadow-lg transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-105 duration-200"
                        onClick={closeModal}
                    >
                        <div className="flex flex-row items-center" >
                            <p className="font-semibold text-xl ml-2">
                                All Properties
                            </p>
                        </div>
                        <Image 
                            src='./arrow1.svg'
                            width={24}
                            height={24}
                            alt='Arrow'
                        />

                    </Link>


                </div>
            </div>
        </div>
    ) : null;
};
export default Modal;

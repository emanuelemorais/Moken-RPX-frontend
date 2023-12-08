import { useState } from "react";
import Image from "next/image";

const CopyToClip = ({ account }) => {
  const [copySuccess, setCopySuccess] = useState(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopySuccess(true);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      setCopySuccess(false);
    }

    // Reset the copy success message after a short delay
    setTimeout(() => {
      setCopySuccess(null);
    }, 2000);
  };

  return (
    <button
      type="button"
      className="flex items-center gap-2 hover:bg-hover_grey px-4 py-2 rounded-full border-[1px] border-grey transition duration-300 ease-in-out text-black font-semibold"
      onClick={copyToClipboard}
    >
      <Image src="/wallet.svg" alt="Wallet Logo" width={17} height={17} />
      {copySuccess === true && <span className="text-green-500">Copied!</span>}
      {copySuccess === false && <span className="text-red-500">Copy failed</span>}
    </button>
  );
};

export default CopyToClip;

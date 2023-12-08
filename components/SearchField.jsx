"use client";

import React, { useState } from "react";

function SearchField({ onSearch }) {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    onSearch(text);
  };

  return (
    <div >
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={handleInputChange}
        className="pl-4 pr-4 py-2 rounded-full w-5/6 border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  );
}

export default SearchField;

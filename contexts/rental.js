
'use client'

import React, { createContext, useState, useContext } from "react";

// Create a context
const SelectedRentalContext = createContext();

// Create a provider component
export const SelectedRentalProvider = ({ children }) => {
  const [selectedRental, setSelectedRental] = useState(null);

  return (
    <SelectedRentalContext.Provider
      value={{ selectedRental, setSelectedRental }}
    >
      {children}
    </SelectedRentalContext.Provider>
  );
};

// Create a custom hook to access the context value


export const useSelectedRental = () => {
  const context = useContext(SelectedRentalContext);
  if (!context) {
    throw new Error(
      "useSelectedRental must be used within a SelectedRentalProvider"
    );
  }
  return context;
};

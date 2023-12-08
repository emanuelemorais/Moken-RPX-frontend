import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModalContext = () => {
  return useContext(ModalContext);
};

export const ModalProvider = ({ children }) => {
  const [openCloseModal, setOpenCloseModal] = useState(false);

  const openAndCloseModal = () => {
    setOpenCloseModal(!openCloseModal);
  };

  return (
    <ModalContext.Provider value={{ openAndCloseModal, openCloseModal }}>
      {children}
    </ModalContext.Provider>
  );
};

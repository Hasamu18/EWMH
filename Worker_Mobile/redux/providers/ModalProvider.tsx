import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of your context
interface ModalProviderProps {
  children: ReactNode;
}

// Create the context with a default value
const ModalContext = createContext<
  | {
      isAddReplacementReasonShown: boolean;
      isUnderWarrantyProductListShown: boolean;

      showAddReplacementReason: () => void;
      hideAddReplacementReason: () => void;
      showUnderWarrantyProductList: () => void;
      hideUnderWarrantyProductList: () => void;
    }
  | undefined
>(undefined);

// Create a provider component
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isAddReplacementReasonShown, setIsAddReplacementReasonShown] = useState(false);
  const [isUnderWarrantyProductListShown, setIsUnderWarrantyProductListShown] = useState(false);

  const showAddReplacementReason = () => {
    setIsAddReplacementReasonShown(true);
  };

  const hideAddReplacementReason = () => {
    setIsAddReplacementReasonShown(false);
  };
  const showUnderWarrantyProductList = () => {
    setIsUnderWarrantyProductListShown(true);
  };
  const hideUnderWarrantyProductList = () => {
    setIsUnderWarrantyProductListShown(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isAddReplacementReasonShown,
        isUnderWarrantyProductListShown,
        showAddReplacementReason,
        hideAddReplacementReason,
        showUnderWarrantyProductList,
        hideUnderWarrantyProductList,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined)
    throw new Error(
      "useModalContext must be used within a ModalProvider"
    );
  return context;
};

import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of your context
interface HeaderBarProviderProps {
  children: ReactNode;
}

// Create the context with a default value
const HeaderBarContext = createContext<
  | {
      isRequestStatusShown: boolean;
      isRequestFilterShown: boolean;

      showRequestStatus: () => void;
      hideRequestStatus: () => void;
      showRequestFilter: () => void;
      hideRequestFilter: () => void;
    }
  | undefined
>(undefined);

// Create a provider component
export const HeaderBarProvider = ({ children }: HeaderBarProviderProps) => {
  const [isRequestStatusShown, setIsRequestStatusShown] = useState(false);
  const [isRequestFilterShown, setIsRequestFilterShown] = useState(false);

  const showRequestStatus = () => {
    setIsRequestStatusShown(true);
  };

  const hideRequestStatus = () => {
    setIsRequestStatusShown(false);
  };
  const showRequestFilter = () => {
    setIsRequestFilterShown(true);
  };
  const hideRequestFilter = () => {
    setIsRequestFilterShown(false);
  };

  return (
    <HeaderBarContext.Provider
      value={{
        isRequestStatusShown,
        isRequestFilterShown,
        showRequestStatus,
        hideRequestStatus,
        showRequestFilter,
        hideRequestFilter,
      }}
    >
      {children}
    </HeaderBarContext.Provider>
  );
};

export const useHeaderBarContext = () => {
  const context = useContext(HeaderBarContext);
  if (context === undefined)
    throw new Error(
      "useHeaderBarContext must be used within a HeaderBarProvider"
    );
  return context;
};

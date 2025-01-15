import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of your context
interface IsLoadingProviderProps {
  children: ReactNode;
}

// Create the context with a default value
const IsLoadingContext = createContext<
  | {
      isLoading: boolean;

      enableIsLoading: () => void;
      disableIsLoading: () => void;
    }
  | undefined
>(undefined);

// Create a provider component
export const IsLoadingProvider = ({ children }: IsLoadingProviderProps) => {
  const [isLoading, setIsLoadingShown] = useState(true);

  const enableIsLoading = () => {
    setIsLoadingShown(true);
  };

  const disableIsLoading = () => {
    setIsLoadingShown(false);
  };

  return (
    <IsLoadingContext.Provider
      value={{
        isLoading,
        enableIsLoading,
        disableIsLoading,
      }}
    >
      {children}
    </IsLoadingContext.Provider>
  );
};

export const useIsLoadingContext = () => {
  const context = useContext(IsLoadingContext);
  if (context === undefined)
    throw new Error(
      "useIsLoadingContext must be used within a IsLoadingProvider"
    );
  return context;
};

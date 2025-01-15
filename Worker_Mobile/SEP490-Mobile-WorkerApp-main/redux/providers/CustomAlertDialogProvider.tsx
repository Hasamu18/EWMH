import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of your context
interface CustomAlertDialogProviderProps {
  children: ReactNode;
}

// Create the context with a default value
const CustomAlertDialogContext = createContext<
  | {
      isShown: boolean;
      message: string;

      show: () => void;
      hide: () => void;
      updateMsg: (msg: string) => void;
    }
  | undefined
>(undefined);

// Create a provider component
export const CustomAlertDialogProvider = ({
  children,
}: CustomAlertDialogProviderProps) => {
  const [isShown, setIsShown] = useState(false);
  const [message, setMessage] = useState("");
  const show = () => {
    setIsShown(true);
  };

  const hide = () => {
    setIsShown(false);
  };
  const updateMsg = (msg: string) => {
    setMessage(msg);
  };

  return (
    <CustomAlertDialogContext.Provider
      value={{
        isShown,
        message,
        show,
        hide,
        updateMsg,
      }}
    >
      {children}
    </CustomAlertDialogContext.Provider>
  );
};

export const useCustomAlertDialogContext = () => {
  const context = useContext(CustomAlertDialogContext);
  if (context === undefined)
    throw new Error(
      "useCustomAlertDialogContext must be used within a CustomAlertDialogProvider"
    );
  return context;
};

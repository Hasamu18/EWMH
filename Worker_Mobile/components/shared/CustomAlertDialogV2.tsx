import Colors from "@/constants/Colors";
import { AlertDialog, Button } from "native-base";
import { useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";

interface CustomAlertDialogV2Props {
  isShown: boolean;
  hideModal: () => void;
  header: string;
  body: string;
  cancelText?: string;
  proceedText: string;
  isActionExecuting?: boolean;
  action?: () => void;
}
export default function CustomAlertDialogV2({
  isShown,
  hideModal,
  header,
  body,
  cancelText,
  proceedText,
  isActionExecuting,
  action,
}: CustomAlertDialogV2Props) {
  const cancelRef = useRef(null);
  const performAction = () => {
    if (action !== undefined) action();
    if (isActionExecuting === undefined) hideModal();
  };
  useEffect(() => {
    //Used when long-running operations are involved (e.g. API calls...)
    if (!isActionExecuting) hideModal();
  }, [isActionExecuting]);
  return (
    <AlertDialog
      isOpen={isShown}
      onClose={() => hideModal()}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>{header}</AlertDialog.Header>
        <AlertDialog.Body>{body}</AlertDialog.Body>
        <AlertDialog.Footer>
          {cancelText === null ? (
            <Button
              backgroundColor={Colors.ewmh.background}
              onPress={() => hideModal()}
            >
              {proceedText}
            </Button>
          ) : (
            <>
              {isActionExecuting ? (
                <ActivityIndicator size="large" />
              ) : (
                <Button.Group space={2}>
                  <Button
                    variant="unstyled"
                    colorScheme="coolGray"
                    onPress={() => hideModal()}
                    ref={cancelRef}
                  >
                    {cancelText}
                  </Button>

                  <Button
                    backgroundColor={Colors.ewmh.background}
                    onPress={performAction}
                  >
                    {proceedText}
                  </Button>
                </Button.Group>
              )}
            </>
          )}
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}

import Colors from "@/constants/Colors";
import { hideModal } from "@/redux/components/customAlertDialogSlice";

import { RootState } from "@/redux/store";
import { AlertDialog, Button } from "native-base";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

interface CustomAlertDialogProps {
  action?: () => void;
}
export default function CustomAlertDialog({ action }: CustomAlertDialogProps) {
  const dispatch = useDispatch();
  const dialogState = useSelector(
    (state: RootState) => state.customAlertDialog
  );

  const cancelRef = useRef(null);
  const performAction = () => {
    if (action !== undefined) action();
    dispatch(hideModal());
  };

  return (
    <AlertDialog
      isOpen={dialogState.isShowing}
      onClose={() => dispatch(hideModal())}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>{dialogState.header}</AlertDialog.Header>
        <AlertDialog.Body>{dialogState.body}</AlertDialog.Body>
        <AlertDialog.Footer>
          {dialogState.cancelText === null ? (
            <Button
              backgroundColor={Colors.ewmh.background}
              onPress={() => dispatch(hideModal())}
            >
              {dialogState.proceedText}
            </Button>
          ) : (
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => dispatch(hideModal())}
                ref={cancelRef}
              >
                {dialogState.cancelText}
              </Button>

              <Button
                backgroundColor={Colors.ewmh.background}
                onPress={performAction}
              >
                {dialogState.proceedText}
              </Button>
            </Button.Group>
          )}
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}

import React, { useEffect, useMemo, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useGlobalState } from "@/context/GlobalProvider";
import { Text, View } from "react-native";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import CustomButton from "./CustomButton";
import { useFocusEffect } from "expo-router";

const ProductSheet = () => {
  const {
    isSheetOpen,
    setIsSheetOpen,
    setSelectedProductFilter,
    selectedProductFilter,
  } = useGlobalState();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "50%", "70%"], []);

  const radioOptions = [
    { label: "Từ cao đến thấp", value: false },
    { label: "Từ thấp đến cao", value: true },
  ];

  // Open/close bottom sheet based on isOpen prop
  useEffect(() => {
    if (isSheetOpen) {
      bottomSheetRef.current?.snapToIndex(1); // Opens the sheet
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isSheetOpen]);

  // Close the sheet when it is dismissed
  const handleClose = () => {
    setIsSheetOpen(false);
  };

  const submit = async () => {
    setSelectedProductFilter(selectedProductFilter);
    handleClose();
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => setIsSheetOpen(false);
    }, [setIsSheetOpen])
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleClose}
      index={-1}
    >
      <BottomSheetView>
        <View className="p-4">
          <Text className="mb-7 text-lg font-semibold">Chọn thứ tự giá</Text>
          <RadioForm formHorizontal={false} animation={true}>
            {radioOptions.map((option, index) => (
              <RadioButton labelHorizontal={true} key={option.value}>
                <View className="flex-row justify-between w-full">
                  <RadioButtonLabel
                    obj={option}
                    index={index}
                    labelHorizontal={true}
                    onPress={() => setSelectedProductFilter(option.value)}
                    labelStyle={{
                      fontSize: 20,
                      color: "#3F72AF",
                      marginBottom: 25,
                    }}
                    labelWrapStyle={{}}
                  />
                  <RadioButtonInput
                    obj={option}
                    index={index}
                    isSelected={selectedProductFilter === option.value}
                    onPress={() => setSelectedProductFilter(option.value)}
                    borderWidth={1}
                    buttonInnerColor={"#3F72AF"}
                    buttonOuterColor={
                      selectedProductFilter === option.value
                        ? "#2196f3"
                        : "#000"
                    }
                    buttonSize={10}
                    buttonOuterSize={20}
                    buttonStyle={{}}
                    buttonWrapStyle={{ marginLeft: 10, marginBottom: 25 }}
                  />
                </View>
              </RadioButton>
            ))}
          </RadioForm>
          <CustomButton
            title="Áp dụng bộ lọc"
            handlePress={submit}
            containerStyles="mt-6"
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ProductSheet;

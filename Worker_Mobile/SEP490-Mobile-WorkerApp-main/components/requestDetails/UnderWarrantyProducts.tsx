import Colors from "@/constants/Colors";
import { PRODUCTS } from "@/dummies/DummyProducts";
import { Badge, Modal, ScrollView, Text } from "native-base";
import React, { useImperativeHandle, useState } from "react";
import { StyleSheet } from "react-native";
import UnderWarrantyProductCard from "./UnderWarrantyProductCard";

export interface UnderWarrantyProductRef {
  showModal: () => void;
}
export const UnderWarrantyProducts = React.forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const getProductCount = () => {
    return PRODUCTS.length;
  };
  useImperativeHandle(ref, () => ({
    showModal: () => {
      setIsOpen(true);
    },
  }));
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <Modal.Content>
          <Modal.CloseButton _icon={{ color: Colors.ewmh.foreground }} />
          <Modal.Header backgroundColor={Colors.ewmh.background}>
            <Text color={Colors.ewmh.foreground} fontWeight="bold">
              Sản phẩm còn bảo hành
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Badge
              colorScheme="info"
              alignSelf="flex-start"
              variant="outline"
              marginBottom={3}
            >
              <Text fontSize="lg">{getProductCount()} sản phẩm</Text>
            </Badge>
            <ScrollView h="95%">
              {PRODUCTS.map((product, key) => {
                return <UnderWarrantyProductCard product={product} key={key} />;
              })}
            </ScrollView>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
    flex: 1,
  },
  productDetails: {
    flexDirection: "column",
    padding: 10,
    flex: 2,
  },
  productImage: {
    width: 20,
    flex: 1,
  },
});

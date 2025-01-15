import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";

import { ShippingOrderDetails_OrderItem } from "@/models/ShippingOrderDetails";
import { setShippingOrderDetailsModalState } from "@/redux/components/shippingOrderDetailsModalSlice";
import { RootState } from "@/redux/store";
import { FormatPriceToVnd } from "@/utils/PriceUtils";
import { HStack, Image, Modal, ScrollView, Text } from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";
import HTMLView from "react-native-htmlview";
import { useDispatch, useSelector } from "react-redux";
import SodWarrantyCard from "./SodWarrantyCard";

export default function ShippingOrderDetailsModal() {
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const shippingOrderItem = useSelector(
    (state: RootState) => state.shippingOrderDetailsModal.shippingOrderItem
  );
  const isModalOpen = useSelector(
    (state: RootState) => state.shippingOrderDetailsModal.isOpen
  );

  const closeModal = () => {
    dispatch(setShippingOrderDetailsModalState(false));
  };
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <Modal.Content height={SCREEN_HEIGHT * 0.8}>
          <Modal.CloseButton _icon={{ color: Colors.ewmh.foreground }} />
          <Modal.Header backgroundColor={Colors.ewmh.background}>
            <Text
              color={Colors.ewmh.foreground}
              fontWeight="bold"
              fontSize="md"
            >
              Chi tiết sản phẩm
            </Text>
          </Modal.Header>
          <Modal.Body>
            <ProductInfoSection
              shippingOrderItem={
                shippingOrderItem as ShippingOrderDetails_OrderItem
              }
            />
            <OrderDetailsSection
              shippingOrderItem={
                shippingOrderItem as ShippingOrderDetails_OrderItem
              }
            />
            <WarrantyCardsSection
              shippingOrderItem={
                shippingOrderItem as ShippingOrderDetails_OrderItem
              }
            />
          </Modal.Body>
          <Modal.Footer>
            {/* {isUpdating ? (
                <ActivityIndicator size="large" />
              ) : (
                <Button onPress={updateDetails}>Cập nhật</Button>
              )} */}
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

function ProductInfoSection({ shippingOrderItem }: DetailsProps) {
  return (
    <>
      <Text
        style={styles.modalHeaderText}
        fontSize="md"
        color={Colors.ewmh.foreground3}
      >
        Thông tin sản phẩm
      </Text>
      <ProductImage image={shippingOrderItem?.product.imageUrl as string} />
      <Details
        shippingOrderItem={shippingOrderItem as ShippingOrderDetails_OrderItem}
      />
    </>
  );
}
function OrderDetailsSection({ shippingOrderItem }: DetailsProps) {
  return (
    <View style={styles.details}>
      <Text
        style={styles.modalHeaderText}
        fontSize="md"
        color={Colors.ewmh.foreground3}
      >
        Thông tin đơn hàng
      </Text>
      <HStack style={styles.productInfoItem} w="100%">
        <Text fontSize="md">Mã sản phẩm</Text>
        <Text fontSize="md" fontWeight="bold">
          {shippingOrderItem.orderDetail.productId}
        </Text>
      </HStack>
      <HStack style={styles.productInfoItem} w="100%">
        <Text fontSize="md">Đơn giá</Text>
        <Text fontSize="md" fontWeight="bold">
          {FormatPriceToVnd(shippingOrderItem.orderDetail.price)}
        </Text>
      </HStack>
      <HStack style={styles.productInfoItem} w="100%">
        <Text fontSize="md">Số lượng</Text>
        <Text fontSize="md" fontWeight="bold">
          x{shippingOrderItem.orderDetail.quantity}
        </Text>
      </HStack>
      <HStack style={styles.productInfoItem} w="100%">
        <Text fontSize="md">Tổng tiền</Text>
        <Text fontSize="md" fontWeight="bold">
          {FormatPriceToVnd(shippingOrderItem.orderDetail.totalPrice)}
        </Text>
      </HStack>
    </View>
  );
}
interface ProductImageProps {
  image: string;
}
function ProductImage({ image }: ProductImageProps) {
  return (
    <Image
      source={{
        uri: image,
      }}
      style={styles.image}
      size="2xl"
      alt="Product Image"
    />
  );
}
interface DetailsProps {
  shippingOrderItem: ShippingOrderDetails_OrderItem;
}
function Details({ shippingOrderItem }: DetailsProps) {
  return (
    <View style={styles.details}>
      <Text fontWeight="bold" fontSize="md" color={Colors.ewmh.background}>
        {shippingOrderItem.product.name}
      </Text>

      <Text fontSize="md" fontWeight="bold" noOfLines={1}>
        Đơn giá: {FormatPriceToVnd(shippingOrderItem.orderDetail.price)}
      </Text>
      <Text fontSize="md" fontWeight="bold" noOfLines={1}>
        Bảo hành: {shippingOrderItem.product.warantyMonths} tháng
      </Text>
      <Description shippingOrderItem={shippingOrderItem} />
    </View>
  );
}

function Description({ shippingOrderItem }: DetailsProps) {
  return (
    <View style={styles.descriptionContainer}>
      <Text fontSize="md" fontWeight="bold">
        Mô tả sản phẩm
      </Text>
      <ScrollView>
        <HTMLView
          value={`<wrapper>${shippingOrderItem.product.description}</wrapper>`}
          stylesheet={htmlViewStyles}
        />
      </ScrollView>
    </View>
  );
}

function WarrantyCardsSection({ shippingOrderItem }: DetailsProps) {
  const warrantyCards =
    shippingOrderItem.orderDetail.warrantyCards.getWarrantyCards;

  return (
    <View>
      <Text
        style={styles.modalHeaderText}
        fontSize="md"
        color={Colors.ewmh.foreground3}
      >
        Thông tin thẻ bảo hành
      </Text>
      <ScrollView h="100%" nestedScrollEnabled={true}>
        {warrantyCards.map((warrantyCard, key) => {
          return <SodWarrantyCard warrantyCard={warrantyCard} key={key} />;
        })}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  productSection: {
    flex: 5,
  },
  image: {
    width: "100%",
  },
  productImage: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.2,
  },
  modalHeaderText: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  productDetails: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 10,
    flex: 2,
  },
  additionalDetails: {
    flex: 5,
    marginVertical: 10,
  },
  descriptionContainer: {
    flex: 1,
    marginVertical: 20,
  },
  inputSpinner: {
    flex: 5,
  },
  addToCart: {
    flex: 5,
    backgroundColor: Colors.ewmh.background,
    height: SCREEN_HEIGHT * 0.06,
    marginLeft: 10,
  },
  purchaseSection: {
    justifyContent: "space-between",
  },
  details: {
    flex: 5,
    marginVertical: 20,
  },
  productInfoItem: {
    justifyContent: "space-between",
    marginVertical: 3,
  },
});
const htmlViewStyles = StyleSheet.create({
  p: {
    fontWeight: "300",
    fontSize: 17,
  },
  strong: {
    fontSize: 17,
    fontWeight: "bold",
  },
  wrapper: {
    fontSize: 17,
    lineHeight: SCREEN_HEIGHT * 0.03,
  },
});

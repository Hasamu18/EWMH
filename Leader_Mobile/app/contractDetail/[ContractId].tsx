import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { Contract } from "@/model/contract";
import { formatDate, getContractStatus, handlePhonePress, useDelayEmptyState, useFakeLoading } from "@/utils/utils";
import EmptyState from "@/components/custom_components/EmptyState";
import { useContract } from "@/hooks/useContract";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import IconButton from "@/components/custom_components/IconButton";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalState } from "@/context/GlobalProvider";
import * as Print from "expo-print";
import * as ImagePicker from "expo-image-picker";
import RenderHTML from "react-native-render-html";
import StatusTag from "@/components/custom_components/StatusTag";

const ContractDetail = () => {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const ContractId = params.ContractId;
  const navigation = useNavigation();
  const {
    contracts,
    setContracts,
    handleScanContract,
    handleGetPendingContract,
    handleGetValidContract,
    handleGetExpiredContract,
    handleCancelContract,
  } = useContract();
  const { loading, setLoading } = useGlobalState();
  const [delayEmptyState, setDelayEmptyState] = useState(true);
  const [fakeLoading, setFakeLoading] = useState(true);


  useFakeLoading(setFakeLoading)
  useDelayEmptyState(setDelayEmptyState);



  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Chi tiết hợp đồng",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
      headerRight: () => (
        <View className="w-24 flex-row justify-evenly">
          {contract?.isOnlinePayment === false && contract?.orderCode === 2 && (
            <IconButton
              icon={
                <MaterialCommunityIcons
                  name="book-cancel-outline"
                  size={30}
                  color="white"
                />
              }
              handlePress={() => confirmCancelContract(contract.contractId)}
            />
          )}
          {contract?.orderCode === 2 && (
            <IconButton
              icon={<Entypo name="upload" size={30} color="white" />}
              handlePress={pickImagesAndCreatePDF}
            />
          )}
        </View>
      ),
    });
  }, [navigation, contracts]);

  const contract = contracts.find(
    (item: Contract) => item.contractId === ContractId
  );

  const fetchAllContracts = useCallback(async () => {
    setLoading(true);
    setContracts([]);
    await handleGetPendingContract();
    await handleGetValidContract();
    await handleGetExpiredContract();
    setLoading(false);
  }, [handleGetPendingContract, handleGetValidContract, handleGetExpiredContract]);

  useFocusEffect(
    useCallback(() => {
      if (!contract) {
        fetchAllContracts();
      }
    }, [contract])
  );

  const confirmCancelContract = (contractId: string) => {
    Alert.alert(
      "Hủy hợp đồng",
      "Bạn có chắc chắn muốn hủy hợp đồng này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            setLoading(true);
            const response = await handleCancelContract(contractId);
            if (response) {
              setContracts([]);
              await handleGetPendingContract();
              await handleGetValidContract();
              await handleGetExpiredContract();
              Alert.alert("Thành công", "Hợp đồng đã được hủy thành công.");
              setLoading(false);
            } else {
              Alert.alert("Thất bại", "Không thể hủy hợp đồng.");
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const downloadContract = async () => {
    setLoading(true);
    if (!contract?.fileUrl) {
      Alert.alert("Lỗi", "Không có file để tải xuống");
      return;
    }

    try {
      Alert.alert("Đang tải xuống", "Tệp đang xuống...");
      const fileUri = `${FileSystem.documentDirectory}${contract.contractId}.pdf`;
      const { uri } = await FileSystem.downloadAsync(contract.fileUrl, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
        Alert.alert("Tải xuống thành công", "Tệp đã lưu xuống thành công");
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Đã gặp lỗi", "Đã gặp lỗi khi đang tải tệp xuống");
      setLoading(false);
    }
  };

  const pickImagesAndCreatePDF = async () => {
    try {
      const selectedImages: string[] = []; // Array to store selected image URIs
  
      while (selectedImages.length < 2) {
        // Launch image picker for a single image
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
        });
  
        if (result.canceled) {
          break; // Exit the loop if the user cancels
        }
  
        // Check if the selected image is valid
        const selectedUri = result.assets?.[0]?.uri;
        if (selectedUri) {
          const fileExtension = selectedUri.split('.').pop()?.toLowerCase();
          if (fileExtension !== 'png' && fileExtension !== 'jpg') {
            Alert.alert('Lỗi', 'Chỉ chấp nhận PNG hoặc JPG');
            continue; // Skip this iteration
          }
          selectedImages.push(selectedUri); // Add the valid image URI to the list
        }
      }
  
      // Ensure the selected images meet the allowed count
      if (selectedImages.length === 0) {
        Alert.alert('Lỗi', 'Không có ảnh nào được chọn');
        return;
      }
  
      // If only 1 image is selected, ask the user to confirm if they want to proceed with 1 image
      if (selectedImages.length === 1) {
        const confirm = await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Chỉ có 1 ảnh',
            'Bạn chỉ chọn 1 ảnh. Bạn có chắc muốn tải lên 1 ảnh?',
            [
              { text: 'Hủy', onPress: () => resolve(false), style: 'cancel' },
              { text: 'Đồng ý', onPress: () => resolve(true) },
            ]
          );
        });
  
        if (!confirm) {
          return; // Exit if the user cancels
        }
      }
  
      // Convert images to base64 and generate PDF
      const base64Images = await Promise.all(
        selectedImages.map((uri) => convertImageToBase64(uri))
      );
      const htmlContent = generateHTMLForPDF(base64Images);
  
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });
  
      // Upload the PDF file
      uploadFile(uri, `${contract?.contractId}.pdf`);
    } catch (error) {
      console.error('Error picking images and creating PDF:', error);
      Alert.alert('Lỗi', 'An error occurred while creating the PDF.');
    }
  };
  
  

  // Function to convert image URI to base64
  const convertImageToBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`; // Or 'image/png' depending on the image type
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  // Updated HTML generation for PDF to embed base64 images
  const generateHTMLForPDF = (base64Images: any) => {
    return `
      <html>
        <body style="margin: 0; padding: 0;">
          ${base64Images
            .map((base64: any) => {
              return `<img src="${base64}" style="width: 91%; height: auto; margin: 0 3rem;" />`;
            })
            .join("")}
        </body>
      </html>`
    ;
  };

  const uploadFile = async (uri: string, fileName: string) => {
    setLoading(true);
    if (!uri || !fileName) {
      Alert.alert("Chưa chọn hợp đồng", "Bạn vẫn chưa chọn ảnh cho hợp đồng");
      setLoading(false);
      return;
    }

    const file = {
      ContractId: contract?.contractId ?? "",
      File: {
        uri,
        name: fileName,
        type: "application/pdf",
      },
    };

    try {
      // Upload the file by calling handleScanContract (assumed that it handles the logic for uploading)
      const uploadResult = await handleScanContract(file);

      if (uploadResult.success) {
        Alert.alert(
          "Đăng thành công",
          `Hợp đồng "${fileName}" đã tải lên thành công.`
        );
        setContracts([]);
        await handleGetPendingContract();
        await handleGetValidContract();
        await handleGetExpiredContract();
        setLoading(false);
      } else {
        Alert.alert("Đăng thất bại", "Đã gặp ra lỗi khi đang tải tệp lên");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error uploading contract file:", error);
      Alert.alert("Lỗi", "Đã gặp ra lỗi khi đang tải tệp lên");
      setLoading(false);
    }
  };

  if (loading || fakeLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  if (!contract || delayEmptyState) {
    return (
      <View className="flex-1 justify-center items-center">
        <EmptyState
          title="Không có hợp đồng"
          subtitle="Không tìm hợp đồng mà bạn cần"
        />
      </View>
    );
  }



  return (
    <ScrollView>
      <SafeAreaView className="flex-1">
        <View className="w-full flex items-center">
          <Text className="bg-[#DBE2EF] text-[#5F60B9] p-4 text-center text-xl font-bold w-full">
            Thông tin hợp đồng
          </Text>
          <View className="w-[70%] flex-row justify-evenly mt-8 flex-wrap">
            <View>
              <Text className="font-bold text-base h-16">Mã hợp đồng:</Text>
              <Text className="font-bold text-base mb-4">
                Trạng thái:
              </Text>
              <Text className="font-bold text-base mb-2">
                Thanh toán:
              </Text>
              <Text className="font-bold text-base mb-2">
                Ngày tạo hợp đồng:
              </Text>
              <Text className="font-bold text-base mb-8">
                Bản scan hợp đồng:
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-base mb-2 h-16 text-right text-gray-500">
                {contract?.contractId ?? "Không có dữ liệu"}
              </Text>
              <View className="mb-2 self-end">
              <StatusTag
                status={getContractStatus(contract.orderCode, contract.remainingNumOfRequests)}
                size="big"
              />
              </View>
              <Text className="text-base mb-2 text-right text-gray-500">
                {contract?.isOnlinePayment
                  ? "Online"
                  : "Tiền mặt"}
              </Text>

              <Text className="text-base mb-2 text-right text-gray-500">
                {contract?.purchaseTime
                  ? formatDate(contract.purchaseTime)
                  : "Không có dữ liệu"}
              </Text>
              {getContractStatus(contract.orderCode, contract.remainingNumOfRequests) === "Chờ Kí" ? <Text
                className="text-blue-700 underline text-base mb-8 text-right"
                onPress={downloadContract}
              >
                Tải hợp đồng
              </Text>
              : 
              <Text
                className="text-blue-700 underline text-base mb-8 text-right"
                onPress={() => {
                  router.push(`/contractPdfViewer/${contract?.contractId}`)
                }}                
              >
                Xem hợp đồng
              </Text>
              }
            </View>
          </View>
        </View>
        <View className="w-full flex items-center">
          <Text className="bg-[#DBE2EF] text-[#5F60B9] p-4 text-center text-xl font-bold w-full">
            Thông tin khách hàng
          </Text>
          <View className="w-[70%] flex-row justify-evenly mt-8">
            <View>
              <Text className="font-bold text-base mb-2">Họ và tên:</Text>
              <Text className="font-bold text-base mb-2">
                Ngày tạo hợp đồng:
              </Text>
              <Text className="font-bold text-base mb-2">Điện thoại:</Text>
              <Text className="font-bold text-base mb-8">Email:</Text>
            </View>
            <View>
              <Text className="text-base mb-2 text-right text-gray-500">
                {contract?.customer.fullName ?? "Không có dữ liệu"}
              </Text>
              <Text className="text-base mb-2 text-right text-gray-500">
                {contract?.customer.dateOfBirth
                  ? formatDate(contract.customer.dateOfBirth)
                  : "Không có dữ liệu"}
              </Text>
              <Text
                className="text-base mb-2 text-right text-blue-700 underline"
                onPress={() => handlePhonePress(contract?.customer.phoneNumber)}
              >
                {contract?.customer.phoneNumber ?? "Không có dữ liệu"}
              </Text>
              <Text className="text-base mb-8 text-right text-gray-500">
                {contract?.customer.email ?? "Không có dữ liệu"}
              </Text>
            </View>
          </View>
        </View>
        <View className="w-full ">
          <Text className="bg-[#DBE2EF] text-[#5F60B9] p-4 text-center text-xl font-bold w-full">
            Thông tin gói dịch vụ
          </Text>
          <View className="px-4 flex items-center">
            <View className="w-full px-2 flex-col justify-evenly items-center mt-3">
              <Image
                source={{
                  uri: `${
                    contract?.servicePackage.imageUrl
                  }&timestamp=${new Date().getTime()}`,
                }}
                className="w-[150px] h-[150px] mr-2 rounded-full"
                resizeMode="cover"
              />
              <Text className="text-lg font-semibold mt-6">
                {contract?.servicePackage.name ?? "Không có dữ liệu"}
              </Text>
            </View>
            <View className="mt-8 mb-5 w-full">
              <Text className="underline text-lg font-bold">Mô tả gói:</Text>
              <View className="w-full">
                <RenderHTML
                  contentWidth={width} // Account for padding
                  source={{
                    html:
                      contract?.servicePackage.description ??
                      "<p>Không có dữ liệu</p>",
                  }}
                />
              </View>
            </View>
            <View className="mt-8 mb-5 w-full">
              <Text className="underline text-lg font-bold">Chính sách:</Text>
              {contract?.servicePackage?.policy
                .split("\n")
                .map((item, index) => (
                  <Text key={index}>
                    {item}
                    {"\n"}
                  </Text>
                ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ContractDetail;
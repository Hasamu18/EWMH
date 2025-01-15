// import React, { useState, useEffect } from "react";
// import { View, Image, SafeAreaView, ScrollView, Text, Alert } from "react-native";
// import { useLocalSearchParams, useNavigation } from "expo-router";
// import * as ImagePicker from "expo-image-picker";
// import CustomButton from "@/components/custom_components/CustomButton";
// import { Ionicons } from "@expo/vector-icons";
// import EmptyState from "@/components/custom_components/EmptyState";
// // import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import * as Print from 'expo-print';


// const ContractImage = () => {
//   const [imageUris, setImageUris] = useState<string[]>(["", ""]); // Array for two images
//   const params = useLocalSearchParams();
//   const ContractId = params.ContractId;
//   const navigation = useNavigation();

//   const contract = contracts.find((c) => c.contractId === ContractId);

//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: "Chi tiết hợp đồng scan",
//       headerTitleAlign: "left",
//       headerStyle: { backgroundColor: "#4072AF" },
//       headerTintColor: "white",
//     });
//     if (contract?.fileUrl) {
//       setImageUris([contract.fileUrl, ""]); // Initialize with existing file URL if available
//     }
//   }, [navigation]);

//   const pickImage = async (index: number) => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       alert("Sorry, we need camera roll permissions to make this work!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     console.log("ImagePicker Result:", result);

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       const newUri = result.assets[0].uri; // Get the selected image URI
//       const updatedImageUris = [...imageUris];
//       updatedImageUris[index] = newUri; // Set the URI for the specific index
//       setImageUris(updatedImageUris); // Update state with new URIs
//     }
//   };

//   const handleSubmit = async () => {
//     if (imageUris.every(uri => uri === "")) {
//       Alert.alert("Error", "Please select at least one image before creating a PDF.");
//       return;
//     }
  
//     const htmlContent = `
//       <html>
//         <body>
//           ${imageUris.map(uri => `<img src="${uri}" style="width: 100%;" />`).join('')}
//         </body>
//       </html>
//     `;
  
//     try {
//       const { uri } = await Print.printToFileAsync({ html: htmlContent });
//       console.log("PDF File Path:", uri);
//       Alert.alert("Success", `PDF created at: ${uri}`);
//     } catch (error : any) {
//       Alert.alert("Error", "Failed to create PDF: " + error.message);
//     }
//   };



//   return (
//     <SafeAreaView className="flex-1">
//       <View className="flex justify-between h-40 mx-2 my-4">
//         <CustomButton
//           title={imageUris[0] === "" ? "Thêm mặt trước hợp đồng" : "Thay mặt trước hợp đồng"}
//           handlePress={() => pickImage(0)} // Add first image
//           icon={<Ionicons name="add-circle-outline" size={24} color="white" />}
//         />
//         <CustomButton
//           title={imageUris[1] === "" ? "Thêm mặt sau hợp đồng" : "Thay mặt sau hợp đồng"}
//           handlePress={() => pickImage(1)} // Add second image
//           icon={<Ionicons name="add-circle-outline" size={24} color="white" />}
//         />
//       </View>
//       {imageUris.some(uri => uri !== "") ? ( // Check if at least one image exists
//         <ScrollView className="mt-10">
//           {imageUris.map((uri, index) => (
//             uri ? ( // Only render if the URI is not empty
//               <View key={index} className="mb-4">
//                 <Text className="text-xl font-semibold mb-2 ml-2">
//                   {index === 0 ? "Mặt trước" : "Mặt sau"}
//                 </Text>
//                 <Image
//                   source={{ uri }}
//                   resizeMode="contain"
//                   className="w-full h-[500px]" // Adjust h for image height
//                 />
//               </View>
//             ) : null
//           ))}
//         </ScrollView>
//       ) : (
//         <View className="mt-20">
//           <EmptyState
//             title="Không ảnh hợp đồng"
//             subtitle="Hãy thêm ảnh hợp đồng vào"
//           />
//         </View>
//       )}
//       <View className="mx-2 mt-4">
//         <CustomButton
//           title="Gửi hợp đồng"
//           handlePress={handleSubmit} 
//           icon={<Ionicons name="checkmark-circle-outline" size={24} color="white" />}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ContractImage;

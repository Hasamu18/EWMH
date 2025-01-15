import { setSearchByName } from "@/redux/components/productSearchSlice";
import { AppDispatch } from "@/redux/store";

import { MaterialIcons } from "@expo/vector-icons";
import { HStack, Icon, Input } from "native-base";
import { useState } from "react";
import { useDispatch } from "react-redux";

export function SearchBar() {
  const [keyword, setKeyword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const showFilterModal = () => {};
  const handleSearch = () => {
    dispatch(setSearchByName(keyword));
  };
  return (
    <HStack w="100%" space={3} alignSelf="center">
      <Input
        placeholder="Tìm kiếm"
        width="100%"
        borderRadius="4"
        fontSize="14"
        onSubmitEditing={handleSearch}
        onChangeText={(keyword) => setKeyword(keyword)}
        InputRightElement={
          <Icon
            m="2"
            ml="3"
            size="6"
            color="gray.400"
            as={<MaterialIcons name="search" />}
            onPress={handleSearch}
          />
        }
      />
      {/* <IconButton
        size="lg"
        icon={<Icon as={Ionicons} name="filter" />}
        color={Colors.ewmh.foreground}
        colorScheme="lightBlue"
        onPress={showFilterModal}
      /> */}
    </HStack>
  );
}

function FilterModal() {
  return;
}

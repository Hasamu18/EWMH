import { View, TextInput, TouchableOpacity, TextInputProps } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

interface SearchInputProps extends TextInputProps{
  placeholder: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSubmitSearch: () => void;
}

const SearchInput = ({ placeholder, searchQuery, setSearchQuery, handleSubmitSearch }: SearchInputProps) => {
  return (
    <View style={{ paddingHorizontal: 16 }} className="bg-[#DBE2EF] w-full h-16 px-4 rounded-2xl items-center flex-row">
      <TextInput
        className="flex-1 text-black font-pregular text-base"
        value={searchQuery}
        placeholder={placeholder}
        placeholderTextColor="#6C757D"
        onChangeText={(e: string) => setSearchQuery(e)}
        onSubmitEditing={handleSubmitSearch}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={handleSubmitSearch}>
        <FontAwesome name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

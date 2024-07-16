import { View, Text } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";
const SearchBar = ({ searchedLocation }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: 10,
        paddingHorizontal: 5,
        backgroundColor: Colors.WHITE,
        borderRadius: 8,
      }}
    >
      <Ionicons
        name="location-sharp"
        size={24}
        color={Colors.PRIMARY}
        style={{ paddingTop: 10 }}
      />
      <GooglePlacesAutocomplete
        placeholder="Search EV Charging Stations"
        fetchDetails={true}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log("placediscription:----", data, details);
          searchedLocation(details?.geometry?.location);
        }}
        query={{
          key: "**",
          language: "en",
        }}
        onFail={(error) => console.error("Google Places API error:", error)}
      />
    </View>
  );
};

export default SearchBar;

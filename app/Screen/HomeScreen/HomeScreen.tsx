import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppMapView from "./AppMapView";
import Header from "./Header";
import SearchBar from "./SearchBar";
import { UserLocationContext } from "../../Context/UserLocationContext";
import { useNavigation } from "@react-navigation/native";
import GlobalApi from "../../Utils/GlobalApi";
import PlaceListView from "./PlaceListView";
import { SelectMarkerContext } from "./../../Context/SelectMarkerContext";
export default function HomeScreen() {
  const { location, setLocation } = useContext(UserLocationContext);
  const navigation = useNavigation();
  const [placeList, setPlaceList] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);
  console.log("current location:", location);
  useEffect(() => {
    location && GetNearByPlace();
  }, [location]);

  const GetNearByPlace = () => {
    if (!location) {
      console.error("Location is null, cannot fetch nearby places.");
      return;
    }

    const data = {
      includedTypes: ["electric_vehicle_charging_station"],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
          radius: 5000.0,
        },
      },
    };
    GlobalApi.NewNearByPlace(data)
      .then((resp) => {
        // console.log("---globalapigetnearby------", JSON.stringify(resp.data));
        setPlaceList(resp.data?.places);
      })
      .catch((error) => {
        console.error("Error fetching nearby places:", error);
        // Log more details about the error
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          console.error("Request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
        console.error("Error config:", error.config);
        // Handle the error accordingly
      });
  };

  return (
    <SelectMarkerContext.Provider value={{ selectedMarker, setSelectedMarker }}>
      <View style={styles.headerContainer}>
        <Header />
        <SearchBar
          searchedLocation={
            (location) =>
              setLocation({
                latitude: location.lat,
                longitude: location.lng,
              })
            // console.log(location)
          }
        />
      </View>
      {placeList && <AppMapView placeList={placeList} />}
      <View style={styles.placeListContainer}>
        {placeList.length > 0 && <PlaceListView placeList={placeList} />}
      </View>
    </SelectMarkerContext.Provider>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    zIndex: 10,
    padding: 10,
    width: "100%",
    paddingHorizontal: 20,
  },
  placeListContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    width: "100%",
  },
});

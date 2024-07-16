import {
  Alert,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useRef, useEffect, useContext } from "react";
// import UserLocationContext from "./../../Context/UserLocationContext";
import { Text, View } from "@/components/Themed";
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Region,
  Marker,
  MarkerPressEvent,
} from "react-native-maps";
import { useNavigation } from "expo-router";
import evChargingPoints from "../../../assets/markers";
import MapViewStyle from "../../Utils/MapViewStyle";
import { UserLocationContext } from "../../Context/UserLocationContext";
import Markers from "./Markers";

const INITIAL_REGION = {
  latitude: 1.24027,
  longitude: 103.851959,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function AppMapView({ placeList }) {
  const mapRef = useRef<MapView>();
  const navigation = useNavigation();
  const { location, setLocation } = useContext(UserLocationContext);
  const onRegionChange = (region: Region) => {
    console.log("region", region);
  };

  return (
    location?.latitude && (
      <View style={{ flex: 1 }}>
        <MapView
          style={StyleSheet.absoluteFill}
          provider={
            Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          showsUserLocation={true}
          // showsMyLocationButton
          onRegionChangeComplete={onRegionChange}
          ref={mapRef}
          customMapStyle={MapViewStyle}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            // latitude: 1.25027,
            // longitude: 103.831959,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* {evChargingPoints.map((marker: any, index: number) => ( */}
          {location ? (
            <Marker
              // key={index}
              coordinate={{
                latitude: location?.latitude,
                longitude: location?.longitude,
              }}
            >
              <Image
                source={require("./../../../assets/images/car_marker.png")}
                style={{ width: 40, height: 40 }}
              />
            </Marker>
          ) : null}
          {/* )) */}
          {/* } */}

          {placeList &&
            placeList.map((item, index) => (
              <Markers key={index} index={index} place={item} />
            ))}
        </MapView>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

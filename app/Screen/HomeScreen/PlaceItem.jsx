import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Pressable,
  Platform,
  Linking,
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { useUser } from "@clerk/clerk-react";
import axios from "axios"; //replace firebase to make the api call
import { LinearGradient } from "expo-linear-gradient";
// import { getFirestore } from "firebase/firestore";
// import { app } from "./../../Utils/FirebaseConfig";
// import { doc, setDoc, deleteDoc } from "firebase/firestore";

export default function PlaceItem({ place, isFav, onToggleFav }) {
  // const API_KEY = "";
  const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
  // const db = getFirestore(app);
  const { user } = useUser();
  // console.log("place data schema:", place);
  //express.js api
  const API_BASE_URL = "http://localhost:4000"; // Example base URL of your Express.js API

  const onSetFav = async (place) => {
    try {
      const body = {
        email: user?.primaryEmailAddress?.emailAddress,
        place_id: place.id.toString(),
        is_favorite: true,
      };
      await axios.post(`${API_BASE_URL}/favorite-places`, body);
      onToggleFav(true); // Update favorite status
      console.log("isFav:", isFav);
      console.log("Fav added:place_id:", place.id.toString());
    } catch (error) {
      console.error("Error adding to favourites: ", error);
    }
  };

  // const onRemoveFav = () => {
  //   console.log("Removed!");
  // };
  const onRemoveFav = async (place) => {
    try {
      const body = {
        email: user?.primaryEmailAddress?.emailAddress,
        // place_id: place.id.toString(),
        place_id: placeId,
        is_favorite: true,
      };
      const placeId = place.id.toString();
      console.log("removed!!!");
      console.log("placeId:", placeId);
      console.log(`${API_BASE_URL}/favorite-places/${placeId}`);
      await axios.delete(`${API_BASE_URL}/favorite-places/${placeId}`, {
        data: body,
      });
      onToggleFav(false); // Update favorite status
    } catch (error) {
      console.error("Error removing from favorites: ", error);
    }
  };
  const onDirectionClick = () => {
    const url = Platform.select({
      ios:
        "maps:" +
        place.location.latitude +
        "," +
        place?.location?.longitude +
        "?q=" +
        place?.formattedAddress,
      android:
        "geo:" +
        place.location.latitude +
        "," +
        place?.location?.longitude +
        "?q=" +
        place?.formattedAddress,
    });

    Linking.openURL(url);
  };

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        margin: 5,
        borderRadius: 10,
        width: Dimensions.get("screen").width * 0.9,
        height: 300,
        marginBottom: 5,
      }}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", "#ffffffff", "#ffffff"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, height: 300 }}
      >
        {!isFav ? (
          <Pressable
            style={{ position: "absolute", right: 0, margin: 5, zIndex: 1 }}
            onPress={() => {
              onSetFav(place);
            }}
          >
            <Ionicons name="heart-outline" size={24} color="red" />
          </Pressable>
        ) : (
          <Pressable
            style={{ position: "absolute", right: 0, margin: 5, zIndex: 1 }}
            onPress={() => {
              onRemoveFav(place);
            }}
          >
            <Ionicons name="heart-sharp" size={30} color="red" />
          </Pressable>
        )}

        <Image
          style={{ width: "100%", borderRadius: 10, height: 150 }}
          source={
            place?.photos
              ? {
                  uri:
                    PLACE_PHOTO_BASE_URL +
                    place?.photos[0]?.name +
                    "/media?key=" +
                    API_KEY +
                    "&maxWidthPx=1200&maxHeightPx=800",
                }
              : require("./../../../assets/images/car_marker.png")
          }
        />
        <View style={{ padding: 10 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              fontFamily: "Semibold",
            }}
          >
            {place.displayName?.text || "Unknown Place"}
          </Text>
          <Text style={{ color: Colors.GRAY, fontFamily: "Outfit" }}>
            {place?.formattedAddress}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 0,
          }}
        >
          <View style={{ margin: 10, padding: 10 }}>
            <Text style={{ color: Colors.GRAY, fontFamily: "Outfit" }}>
              Connectors
            </Text>
            <Text style={{ color: Colors.BLACK, fontFamily: "Bold" }}>
              {place?.evChargeOptions?.connectorCount > 0
                ? `${place?.evChargeOptions?.connectorCount} Points`
                : `unknown`}
            </Text>
          </View>
          <Pressable
            onPress={() => onDirectionClick()}
            style={{
              padding: 10,
              marginBottom: 25,
              backgroundColor: Colors.PRIMARY,
              borderRadius: 6,
              paddingHorizontal: 12,
              right: 20,
            }}
          >
            <FontAwesome name="location-arrow" size={25} color="white" />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

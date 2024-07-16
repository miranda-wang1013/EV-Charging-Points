import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import { useUser } from "@clerk/clerk-expo";
import { UserLocationContext } from "../../Context/UserLocationContext";
import PlaceItem from "../HomeScreen/PlaceItem";
import PlaceListView from "../HomeScreen/PlaceListView";
import axios from "axios";
import GlobalApi from "../../Utils/GlobalApi";

export default function FavoriteScreen() {
  const { user } = useUser();
  const { location, setLocation } = useContext(UserLocationContext);
  const [favList, setFavList] = useState([]);
  const [placeList, setPlaceList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    user && getFav();
  }, [user]);

  // const getFav = async () => {
  //   setLoading(true);
  //   setFavList([]);
  //   const q = query(
  //     collection(db, "ev-fav-place"),
  //     where("email", "==", user?.primaryEmailAddress?.emailAddress)
  //   );
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     setFavList((favList) => [...favList, doc.data()]);
  //     setLoading(false);
  //   });
  // };

  useEffect(() => {
    location && GetNearByPlace();
  }, [location]);

  useEffect(() => {
    if (placeList.length > 0) {
      getFav();
    }
  }, [placeList]);

  const GetNearByPlace = () => {
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

  const getFav = async () => {
    setLoading(true);
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const response = await axios.get(
        `http://localhost:4000/favorite-places`,
        {
          params: { email: userEmail },
        }
      );

      const favPlaceIds = response.data.map((item) => item.place_id);
      console.log("favPlaceIds", favPlaceIds);
      placeList.map((place) => {
        console.log(place.id);
      });
      const favPlaces = await placeList.filter((place) => {
        return place.id && favPlaceIds.includes(place.id) && place.displayName;
      });
      console.log("FavScreen-----favPlaces:", favPlaces);
      setFavList(favPlaces);
    } catch (error) {
      console.error("Error fetching favorite places: ", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFav = async (place, isFavorite) => {
    try {
      const body = {
        email: user?.primaryEmailAddress?.emailAddress,
        place_id: place.id.toString(),
        is_favorite: isFavorite,
      }; //是否
      if (isFavorite) {
        // await axios.post(`http://localhost:4000/favorite-places`, body);
      } else {
        const placeId = place.id.toString();
        // await axios.delete(`http://localhost:4000/favorite-places/${placeId}`, {
        //   data: body,
        // });
      }
      getFav(); // Refresh favorite list
    } catch (error) {
      console.error("Error updating favorite: ", error);
    }
  };

  return (
    <View style={{ left: 13, alignItem: "center" }}>
      <Text
        style={{
          padding: 10,
          fontFamily: "outfit-medium",
          fontSize: 30,
        }}
      >
        Favorite
        <Text style={{ color: Colors.PRIMARY }}> Place</Text> Nearby
      </Text>
      {!favList ? (
        <View
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: "outfit", marginTop: 5 }}>Loading...</Text>
        </View>
      ) : null}
      <FlatList
        data={favList}
        onRefresh={() => getFav()}
        keyExtractor={(item, index) => index.toString()}
        refreshing={loading}
        style={{ paddingBottom: 200 }}
        renderItem={({ item, index }) => {
          console.log("Rendering item:", item.displayName.text);
          return item && item.displayName ? (
            <PlaceItem
              place={item}
              isFav={true}
              onToggleFav={(isFavorite) => toggleFav(item, isFavorite)}
            />
          ) : null;
        }}
      />

      <View style={{ marginBottom: 200, height: 200 }}></View>
    </View>
  );
}

import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState, useContext } from "react";
import PlaceItem from "./PlaceItem";
import { SelectMarkerContext } from "./../../Context/SelectMarkerContext";
// import { getFirestore } from "firebase/firestore";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { app } from "./../../Utils/FirebaseConfig";
import { useUser } from "@clerk/clerk-react";
import axios from "axios"; // Import axios for HTTP requests

const PlaceListView = ({ placeList }) => {
  const flatListRef = useRef(null);
  const { selectedMarker, setSelectedMarker } = useContext(SelectMarkerContext);
  const [index, setIndex] = useState(0); // Initial index
  const { user } = useUser();
  const [favList, setFavList] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log("----placeList-------", placeList);
  // useEffect(() => {
  //   selectedMarker && scrollToIndex(index);
  // }, [selectedMarker]);

  useEffect(() => {
    if (selectedMarker !== undefined && selectedMarker !== null) {
      setIndex(selectedMarker);
    }
  }, [selectedMarker]);

  useEffect(() => {
    scrollToIndex(index);
  }, [index]);

  const scrollToIndex = (index) => {
    if (index >= 0 && index < placeList.length) {
      flatListRef.current?.scrollToIndex({ animated: true, index });
    } else {
      console.log("placeListView---placeList:", placeList);
      console.warn(
        `Index out of range: ${index}`,
        "placeList.lengh:",
        placeList.length
      );
    }
  };

  const getItemLayout = (_, index) => ({
    length: Dimensions.get("window").width,
    offset: Dimensions.get("window").width * index,
    index,
  });

  useEffect(() => {
    if (user) {
      getFav(); // 确保在获取收藏列表时 placeList 已经有数据
    }
  }, [user, placeList]); // 添加 placeList 作为 useEffect 的依赖项
  useEffect(() => {
    const fetchData = async () => {
      // Fetch placeList data from API or wherever it's stored
      // setPlaceList(fetchedPlaceList);
      await getFav(); // Call getFav after placeList is set
    };

    fetchData();
  }, []); // Empty dependency array means it runs once after initial render

  // useEffect(() => {
  //   user && getFav();
  // }, [user]);

  // const getFav = async () => {
  //   setFavList([]);
  //   const userEmail = user?.primaryEmailAddress?.emailAddress;
  //   console.log("userEmail:", userEmail);
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:4000/favorite-places`,
  //       {
  //         params: { email: userEmail },
  //       }
  //     );
  //     console.log("FavList Response Data:", response.data);
  //     console.log(typeof response.data);
  //     setFavList(response.data);
  //   } catch (error) {
  //     console.error("Error fetching favorite places: ", error);
  //   }
  // };

  const getFav = async (place) => {
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const response = await axios.get(
        `http://localhost:4000/favorite-places`,
        {
          params: { email: userEmail },
        }
      );
      // console.log("apiIds:", placeList);
      // console.log("apiIds2 of first element:", placeList[0].id);
      // console.log("apiIds3:");

      // placeList.map((place) => {
      //   console.log(place.id);
      // });

      const favPlaceIds = response.data.map((item) => item.place_id);
      // console.log("----serverfavIds:", typeof favPlaceIds[0]);
      // console.log("----favPlaceIds:", favPlaceIds);
      const favPlaces = await placeList.filter((place) => {
        return place.id && favPlaceIds.includes(place.id);
      });

      // const favPlacesArray = Object.values(favPlaces);
      // console.log("favPlacesArray", favPlacesArray);
      // console.log("favPlacesArray2", typeof favPlacesArray);

      setFavList(favPlaces);
    } catch (error) {
      console.error("Error fetching favorite places: ", error);
    }
  };

  const isFav = (place) => {
    // console.log("Checking item", placeList);
    // console.log("Checking favList", favList);
    // 检查 favList 是否为数组
    if (!Array.isArray(favList)) {
      // console.log("favList is not an array:", favList);
      return false;
    }

    // 遍历 favList，检查每个 item 的 place_id 是否与 place.id 匹配
    const result = favList.some((item) => {
      // console.log("Comparing item.id with place.id:", item.id, place.id);
      return item.id === place.id;
    });

    // console.log(`Is place ${place.displayName.text} favorite? ${result}`);
    return result;
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
    <View style={styles.container}>
      <FlatList
        data={placeList}
        horizontal={true}
        pagingEnabled
        refreshing={loading}
        onRefresh={() => getFav()}
        ref={flatListRef} // if not add this line, the flatListRef.current will be null
        getItemLayout={getItemLayout}
        showHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.itemContainer}>
            <PlaceItem
              place={item}
              isFav={isFav(item)}
              onToggleFav={(isFavorite) => toggleFav(item, isFavorite)} //remove the arrow, can't wrap async function here
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x /
                    Dimensions.get("window").width
                );
                scrollToIndex(index);
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the content horizontally
    paddingBottom: 10, // Optional padding
  },
  itemContainer: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default PlaceListView;

import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";

const Header = () => {
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user?.imageUrl }}
        style={{ marginTop: 10, width: 40, height: 40, borderRadius: 99 }}
      />
      <Image
        source={require("../../../assets/images/logo.png")}
        style={{ width: 150, height: 30, objectFit: "contain" }}
      />
      <FontAwesome name="filter" size={24} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    backgroundColor: Colors.WHITE_TRANSP,
  },
});

export default Header;

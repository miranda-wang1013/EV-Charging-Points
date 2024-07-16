import { useCallback } from "react";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Platform, Button } from "react-native";
import HomeScreen from "./Screen/HomeScreen/HomeScreen";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import LoginScreen from "./Screen/LoginScreen/LoginScreen"; // add here
import { NavigationContainer } from "@react-navigation/native";
import OnboardingScreen from "./Screen/OnboardingScreen/OnboardingScreen";
import { ClerkProvider, useAuth, SignedIn, SignedOut } from "@clerk/clerk-expo"; //useAuth load user's current information
import * as ExpoSecureStore from "expo-secure-store";
import TabNavigation from "./Navigations/TabNavigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Slot } from "expo-router";
import * as Location from "expo-location";
import { UserLocationContext } from "./Context/UserLocationContext";
import { RootSiblingParent } from "react-native-root-siblings";

const Stack = createNativeStackNavigator();

// SplashScreen.preventAutoHideAsync();
export default function App() {
  const { isSignedIn } = useAuth(); // useAuth
  console.log("isSignedIn(index)", isSignedIn);

  //get user location
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      console.log("---Get user location---", location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  const [fontsLoaded, fontError] = useFonts({
    Outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    Semibold: require("../assets/fonts/Outfit-SemiBold.ttf"),
    Bold: require("../assets/fonts/Outfit-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <>
      <RootSiblingParent>
        <UserLocationContext.Provider value={{ location, setLocation }}>
          {isSignedIn ? <TabNavigation /> : <OnboardingScreen />}
        </UserLocationContext.Provider>
      </RootSiblingParent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import { View, Text, Platform, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, Slot, useSegments, useRouter } from "expo-router";
import * as ExpoSecureStore from "expo-secure-store"; //correctly catch the JWT get back from clerk，keep signed in when refreshing the page
import { ClerkProvider, useAuth, SignedIn, SignedOut } from "@clerk/clerk-expo"; //useAuth load user's current information
import { Ionicons } from "@expo/vector-icons";
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUVLIC_CLERK_PUBLISHABLE_KEY;
const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS !== "web") {
        return await ExpoSecureStore.getItemAsync(key);
      } else {
        return localStorage.getItem(key);
      }
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return ExpoSecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    console.log("Segments: ", segments);
    const inTabsGroup = segments[0] === "(auth)";
    console.log("isSignedIn: ", isSignedIn);
    console.log("inTabsGroup: ", inTabsGroup);
    if (isSignedIn && !inTabsGroup) {
      router.replace("/");
    } else if (!isSignedIn && inTabsGroup) {
      router.replace("/(auth)/SignUpScreen");
    }
  }, [isLoaded, isSignedIn, segments]);

  const handleBackPress = () => {
    router.replace("/");
  };
  const isOnBoardingScreen = segments.length === 0 || segments[0] === "";
  return (
    <View style={{ flex: 1 }}>
      {!isOnBoardingScreen && (
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, fontSize: 18 }}>Back</Text>
        </View>
      )}
      <Slot />
    </View>
  );
};

const StackLayout = () => {
  const router = useRouter();

  return (
    <ClerkProvider
      publishableKey="
      pk_test_cmVuZXdlZC13b29kY29jay0xNS5jbGVyay5hY2NvdW50cy5kZXYk
        "
      tokenCache={tokenCache}
    >
      <InitialLayout />
    </ClerkProvider>
  );
};

export default StackLayout;

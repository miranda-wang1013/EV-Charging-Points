import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Link, router, useRouter } from "expo-router";
import Colors from "../../Utils/Colors";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../../../hooks/useWarmUpBrowser";
import Spinner from "react-native-loading-spinner-overlay";
import HomeScreen from "../HomeScreen/HomeScreen";

WebBrowser.maybeCompleteAuthSession();

export default function OnboardingScreen() {
  useWarmUpBrowser();
  const router = useRouter();

  // const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const onPress = () => {
    console.log("Button Pressed");
    router.replace("/Screen/SignUpScreen/SignUpScreen");
    // try {
    //   const { createdSessionId, signIn, signUp, setActive } =
    //     await startOAuthFlow();

    //   if (createdSessionId) {
    //     setActive({ session: createdSessionId });
    //   } else {
    //     // Use signIn or signUp for next steps such as MFA
    //   }
    // } catch (err) {
    //   console.error("OAuth error", err);
    // }
  };

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 70,
      }}
    >
      <Image
        source={require("./../../../assets/images/logo.png")}
        style={styles.logoImage}
      />
      <Image
        source={require("./../../../assets/images/ev-charging.png")}
        style={styles.bgImage}
      />
      <View style={{ padding: 20 }}>
        <Text style={styles.heading}>
          Your Ultimate EV Charging Station Finder App
        </Text>
        <Text style={styles.desc}>Find EV charging station near you</Text>
        <Link href={"/Screen/SignUpScreen/SignUpScreen"} asChild>
          <TouchableOpacity
            style={styles.button}
            // onPress={()  => console.log("click login with Google")}
            onPress={onPress}
          >
            <Text
              style={{
                color: Colors.WHITE,
                textAlign: "center",
                fontFamily: "outfit",
                fontSize: 17,
              }}
            >
              Start
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  logoImage: {
    width: 280,
    height: 40,
    objectFit: "contain",
  },
  bgImage: {
    width: 300,
    height: 150,
    marginTop: 35,
    objectFit: "cover",
  },
  heading: {
    fontSize: 25,
    fontFamily: "semiBold",
    textAlign: "center",
    marginTop: 20,
  },
  desc: {
    fontSize: 17,
    fontFamily: "outfit",
    marginTop: 15,
    textAlign: "center",
    color: Colors.GRAY,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    display: "flex",
    borderRadius: 99,
    marginTop: 40,
  },
});

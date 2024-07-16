import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import Colors from "../../Utils/Colors";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Alert,
  Image,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const SignUpScreen = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();

  const SignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      console.log("clicked!!!");
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      console.log("signInAttempt:", signInAttempt.status);
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/Navigations/TabNavigation");
        console.log("isSignedIn from LoginScreen:", isSignedIn);
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/signin.png")}
        style={styles.logoImage}
      />
      <Spinner visible={loading} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          autoCapitalize="none"
          placeholder="mirawang@rocket.com"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="password"
          value={password}
          onChangeText={setPassword}
        ></TextInput>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={SignInPress}>
        <Text
          style={{
            color: Colors.WHITE,
            textAlign: "center",
            fontFamily: "outfit",
            fontSize: 17,
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
      <Link href="/Screen/SignUpScreen/reset" asChild>
        <Pressable style={styles.button}>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href="/Screen/SignUpScreen/register" asChild>
        <Pressable style={styles.button}>
          <Text>Create Account</Text>
        </Pressable>
      </Link>
    </View>
  );
};
const styles = StyleSheet.create({
  logoImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  inputContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    width: 300,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 15,
    margin: 8,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    display: "flex",
    borderRadius: 99,
    marginTop: 18,
  },
});
export default SignUpScreen;

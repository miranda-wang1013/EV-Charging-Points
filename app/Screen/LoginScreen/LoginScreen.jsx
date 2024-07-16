import { useSignedIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Alert,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const LoginScreen = () => {
  const { signIn, setActive, isLoaded } = useSignedIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth(); // Add this line to access isSignedIn

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
      <Spinner visible={loading} />
      <TextInput
        autoCapitalize="none"
        placeholder="mirawang@rocket.com"
        value={emailAddress}
      ></TextInput>
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
      ></TextInput>
      <Button onPress={SignInPress} title="Login"></Button>
      <Link href="/reset" asChild>
        <Pressable style={styles.button}>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default LoginScreen;

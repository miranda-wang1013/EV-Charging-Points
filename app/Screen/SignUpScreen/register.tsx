import {
  Button,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Text,
} from "react-native";
import { useSignUp, useAuth } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { useState, useEffect } from "react";
import { Stack, Link, router } from "expo-router";
import React from "react";
import Colors from "../../Utils/Colors";

const Register = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth(); // Add this line to access isSignedIn
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      console.log("User is signed in:", isSignedIn);
      alert("User is signed in");
    }
  }, [isSignedIn]);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    setLoading(true); // Start the spinner
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      // console.log("completeSignUp:", completeSignUp);
      // Add a slight delay to ensure the state is updated
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.log("sign up failed!");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      alert(
        err.errors
          ? err.errors[0].message
          : "Verification failed. Please try again."
      );
    } finally {
      setLoading(false); // Stop the spinner
    }
    router.replace("/Navigations/TabNavigation");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />

      {!pendingVerification && (
        <View>
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
          <TouchableOpacity style={styles.loginButton} onPress={onSignUpPress}>
            <Text
              style={{
                color: Colors.WHITE,
                textAlign: "center",
                fontFamily: "outfit",
                fontSize: 17,
              }}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {pendingVerification && (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              value={code}
              placeholder="Code..."
              onChangeText={setCode}
            ></TextInput>
          </View>
          <Button
            onPress={onPressVerify}
            title="Verify Email"
            color={"#6c47ff"}
          ></Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 20,
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

export default Register;

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import SplashScreen from "react-native-splash-screen"; // Ensure it's correctly imported
import { StackNavigationProp } from "@react-navigation/stack";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");
type RootStackParamList = {
  Splash: undefined;
  Index: undefined;
};

type SplashScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Splash">;
};

const Splash = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/HoldingsScreen");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/NF.png")} style={styles.logo} />
      <ActivityIndicator size="large" color="white" />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 350,
    height: 350,
    borderRadius: 100,
    borderWidth: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
});

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Login/components/Button";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { ref, onValue, set, update, get } from "firebase/database";
import Background from "../components/Login/components/Background";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [authId, setAuthId] = useState();
  const [driver, setDriver] = useState();

  const getLoggedInUser = async () => {
    const driversRef = ref(db, `drivers/${authId}/`);
    const snapshot = await get(driversRef);
    const user = snapshot.val();
    setDriver(user);
    return user;
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuthId(user.uid);
    } else {
      navigation.navigate("StartScreen");
    }
  });

  const onLogOutPressed = async () => {
    await signOut(auth);
    console.log("user isLogOut", user);
  };

  return (
    <View>
      <SafeAreaView>
        <ImageBackground
          source={require("../assets/LogoMarovi.png")}
          style={styles.image}
        >
          <Text style={styles.text}>
            {driver?.surname} {driver?.name}
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("OrdersStack", { screen: "Orders" })
            }
            style={styles.button}
          >
            <Text style={styles.textButton}>Comenzi</Text>
          </TouchableOpacity>
          <Button mode="contained" onPress={onLogOutPressed}>
            LogOut
          </Button>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  image: {
    width: " 100%",
    height: "100%",
  },
  text: {
    borderRadius: 10,
    color: "white",
    fontSize: 20,
    lineHeight: 40,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
  textButton: {
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
  button: {
    bottom: "0%",
    backgroundColor: "purple",
    padding: 10,
    margin: 20,
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
});

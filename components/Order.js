import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { ref, update } from "firebase/database";
import { db } from "../firebase";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { useRoute } from "@react-navigation/native";
import { GOOGLE_MAPS_API_KEY } from "@env";
import Car from "../assets/carIcon.png";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Order = () => {
  const [driverId, setDriverId] = useState("");

  const route = useRoute();
  const { orderParams } = route.params;
  const [order, setOrder] = useState();
  const [addressCoords, setAddressCoords] = useState();
  const [destination, setDestination] = useState(null);
  const [newAddress, setNewAddress] = useState(null);
  const [origin, setOrigin] = useState({
    latitude: 39.96089,
    longitude: -0.22871,
  });
  onAuthStateChanged(auth, (driver) => {
    if (driver) {
      setDriverId(driver.uid);
    } else {
    }
  });
  // const { orderId, orderAddress } = route.params;
  useEffect(() => {
    setOrder(orderParams);
    setDestination(orderParams.addressCoords);
  }, [route, addressCoords]);

  // console.log(typeof order.startDate);

  useEffect(() => {
    if (newAddress) {
      setDestination({
        latitude: newAddress.latitude,
        longitude: newAddress.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    }
  }, [newAddress]);

  async function getLocationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied !");
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setOrigin(current);
  }
  useEffect(() => {
    getLocationPermission();
  }, []);

  const handleRegionChange = (newRegion) => {
    setDestination(newRegion);
    MapView.current.animateToRegion(newRegion, 500);
  };

  const newDriverState = () => {
    const newState = { state: "Liber" };

    const driverRef = ref(db, `drivers/${driverId}`);
    update(driverRef, newState)
      .then((data) => console.log("Driver Free"))
      .catch((err) => console.error(err));
  };

  const rejectOrder = () => {
    const newState = { state: "Refuzat" };

    const orderRef = ref(db, `orders/${order.id}`);
    update(orderRef, newState)
      .then((data) => console.log("Order rejected"))
      .catch((err) => console.error(err));

    newDriverState();

    // TO DO
    // setDriverState("Liber");
  };

  return (
    <View>
      <MapView
        showsMyLocationButton={true}
        showsUserLocation={true}
        followsUserLocation={true}
        region={destination}
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        // onRegionChange={handleRegionChange}
        provider="google"
      >
        {origin && (
          <>
            <MapViewDirections
              origin={origin}
              destination={destination}
              strokeColor="purple"
              strokeWidth={7}
              apikey={GOOGLE_MAPS_API_KEY}
            />
            <Marker
              coordinate={origin}
              image={Car}
              title="I'm here !"
              pinColor="black"
              // draggable={true}
              // onDragEnd={(e) => {
              //   setOrigin({
              //     latitude: e.nativeEvent.coordinate.latitude,
              //     longitude: e.nativeEvent.coordinate.longitude,
              //   });
              // }}
            ></Marker>
            <Marker coordinate={destination} title="Taxi !" />
          </>
        )}
      </MapView>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{order?.address}</Text>
        <Text style={styles.infoText}>
          {"Solicitarea facuta la: "}
          {new Date(order?.startDate).toLocaleTimeString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => {}} style={styles.button}>
        <Text onPress={rejectOrder} style={styles.textButton}>
          REFUZ COMANDA
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  map: {
    width: " 100%",
    height: "75%",
    marginTop: 5,
  },
  infoBox: {
    marginTop: 5,
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "silver",
    width: "80%",
    borderRadius: 15,
  },
  infoText: {
    fontSize: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "orangered",
    padding: 5,
    marginTop: 5,
    width: "60%",
    alignSelf: "center",
    borderRadius: 10,
  },
  textButton: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
});

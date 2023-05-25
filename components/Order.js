import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { useRoute } from "@react-navigation/native";
import { GOOGLE_MAPS_API_KEY } from "@env";
import Car from "../assets/carIcon.png";

const Order = () => {
  const route = useRoute();
  const { orderParams } = route.params;
  const [order, setOrder] = useState();
  const [addressCoords, setAddressCoords] = useState();
  const [region, setRegion] = useState(null);
  const [newAddress, setNewAddress] = useState(null);
  const [origin, setOrigin] = useState({
    latitude: 39.96089,
    longitude: -0.22871,
  });
  // const { orderId, orderAddress } = route.params;
  useEffect(() => {
    setOrder(orderParams);
    setRegion(orderParams.addressCoords);
  }, [route, addressCoords]);

  console.log(region);

  useEffect(() => {
    if (newAddress) {
      setRegion({
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
    setRegion(newRegion);
    MapView.current.animateToRegion(newRegion, 500);
  };

  return (
    <View>
      <MapView
        showsMyLocationButton={true}
        showsUserLocation={true}
        followsUserLocation={true}
        region={origin}
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
              destination={region}
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
            <Marker coordinate={region} title="Taxi !" />
          </>
        )}
      </MapView>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{order?.address}</Text>
        <Text style={styles.infoText}> {order?.startDate}</Text>
      </View>
      <TouchableOpacity onPress={() => {}} style={styles.button}>
        <Text style={styles.textButton}>REFUZ COMANDA</Text>
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

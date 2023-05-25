import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ref, onValue, set, remove, update } from "firebase/database";
import { db } from "../firebase";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { database } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Orders = () => {
  const [ordersList, setOrdersList] = useState();
  const [orderState, setOrderState] = useState("In asteptare");
  const [driverState, setDriverState] = useState("Liber");
  const [driverId, setDriverId] = useState();

  const navigation = useNavigation();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setDriverId(user.uid);
    } else {
    }
  });

  const waitingOrders = () => {
    const ordersRef = ref(db, "orders");
    onValue(ordersRef, (snapshot) => {
      const tmpArray = [];

      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();

        tmpArray.push({ id: childKey, ...childData });
      });
      const orders = tmpArray;
      const pendingOrders = orders.filter(
        (order) => order.state === orderState
      );
      setOrdersList(pendingOrders);
    });
  };

  useEffect(() => {
    waitingOrders();
  }, [orderState]);

  const getOrder = (order) => {
    const newState = { state: "preluat", driverId: driverId };

    const orderRef = ref(db, `orders/${order.id}`);
    update(orderRef, newState)
      .then((data) => console.log("Order taked"))
      .catch((err) => console.error(err));

    // TO DO
    setDriverState("Ocupat");
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {ordersList?.map((order, index) => {
          return (
            <View key={index} style={styles.order}>
              <Text style={styles.textOrder}>{order.address}</Text>
              <TouchableOpacity
                onPress={() => {
                  getOrder(order);
                  navigation.navigate("OrdersStack", {
                    screen: "Order",
                    params: { orderParams: order },
                  });
                }}
                style={styles.button}
              >
                <Text style={styles.textButton}>Preia comanda</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate("Order")}
        style={styles.button}
      >
        <Text style={styles.textButton}>COMANDA PRELUATA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Orders;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "firebrick",
    padding: 5,

    width: "60%",
    alignSelf: "center",
    borderRadius: 10,
  },
  textButton: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  textOrder: {
    color: "black",
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 5,
    overflow: "hidden",
    margin: 10,
  },
  order: {
    alignSelf: "center",
    width: "90%",
    backgroundColor: "darksalmon",
    borderRadius: 15,
    overflow: "hidden",
    padding: 5,
    fontSize: 15,
    marginTop: 8,
  },
});

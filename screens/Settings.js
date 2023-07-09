import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import Background from "../components/Login/components/Background";
import { useNavigation } from "@react-navigation/native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { ref, onValue, set, update, get } from "firebase/database";
import Header from "../components/Login/components/Header";
import { ListItem } from "@react-native-material/core";
import {
  Stack,
  TextInput,
  IconButton,
  Switch,
} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Button from "../components/Login/components/Button";
import { Foundation, MaterialIcons, AntDesign } from "@expo/vector-icons";

const Settings = () => {
  const navigation = useNavigation();
  const [driver, setDriver] = useState(false);
  const [authId, setAuthId] = useState();
  const [driverData, setDriverData] = useState();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [indicativ, setIndicativ] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [model, setModel] = useState("");
  const [colour, setColour] = useState("");
  const [smokers, setSmokers] = useState(true);
  const [bigLuggage, setBigLuggage] = useState(true);
  const [withPets, setWithPets] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthId(user.uid);
        setDriver(true);
      } else {
        navigation.navigate("StartScreen");
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate("StartScreen");
      setDriver(false);
      console.log("signed out");
    });
  };

  const getDriverData = async () => {
    const driversRef = ref(db, `drivers/${authId}/`);
    const snapshot = await get(driversRef);
    const user = await snapshot.val();
    if (user) {
      setName(user.name);
      setSurname(user.surname);
      setPhone(user.phone);
      setRegisterNumber(user.registerNumber);
      setModel(user.model);
      setColour(user.colour);
      setSmokers(user.smokers);
      setBigLuggage(user.bigLuggage);
      setWithPets(user.withPets);
    }
  };

  useEffect(() => {
    if (authId) {
      getDriverData();
    }
  }, [authId]);

  const copletePerfil = () => {
    const driverRef = ref(db, `drivers/${authId}/`);
    const newData = {
      name: name,
      surname: surname,
      phone: phone,
      registerNumber: registerNumber,
      model: model,
      colour: colour,
      smokers: smokers,
      bigLuggage: bigLuggage,
      withPets: withPets,
    };

    update(driverRef, newData)
      .then((data) => console.log("driver Updated"))
      .catch((err) => console.error(err));
    alert("ACTUALIZARE CORECTA");
    // }
  };

  return (
    <ScrollView>
      {driver ? (
        <Stack spacing={1} style={{ margin: 16 }}>
          <TextInput
            autoCapitalize="words"
            style={styles.imput}
            label="Nume"
            leading={(props) => <Icon name="account" {...props} />}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            autoCapitalize="words"
            style={styles.imput}
            label="Prenume"
            leading={(props) => <Icon name="account" {...props} />}
            value={surname}
            onChangeText={(text) => setSurname(text)}
          />
          <TextInput
            keyboardType="number-pad"
            style={styles.imput}
            label="Telefon"
            leading={() => (
              <Foundation name="telephone" size={24} color="grey" />
            )}
            value={phone}
            onChangeText={(text) => setPhone(text)}
          />
          <TextInput
            autoCapitalize="characters"
            style={styles.imput}
            label="Nr. de Inmatriculare"
            leading={(props) => (
              <AntDesign name="car" size={24} color="black" />
            )}
            value={registerNumber}
            onChangeText={(text) => setRegisterNumber(text)}
          />
          <TextInput
            autoCapitalize="characters"
            style={styles.imput}
            label="Modelul masinii"
            leading={(props) => (
              <AntDesign name="car" size={24} color="black" />
            )}
            value={model}
            onChangeText={(text) => setModel(text)}
          />
          <TextInput
            autoCapitalize="characters"
            style={styles.imput}
            label="Culoarea masinii"
            leading={(props) => (
              <AntDesign name="car" size={24} color="black" />
            )}
            value={colour}
            onChangeText={(text) => setColour(text)}
          />
          <ListItem
            title="Fumatori"
            trailing={
              <Switch
                value={smokers}
                onValueChange={() => setSmokers(!smokers)}
              />
            }
            onPress={() => setSmokers(!smokers)}
          />
          <ListItem
            title="Cu bagaje mari"
            trailing={
              <Switch
                value={bigLuggage}
                onValueChange={() => setBigLuggage(!bigLuggage)}
              />
            }
            onPress={() => setBigLuggage(!bigLuggage)}
          />
          <ListItem
            title="Cu animale de companie"
            trailing={
              <Switch
                value={withPets}
                onValueChange={() => setWithPets(!withPets)}
              />
            }
            onPress={() => setWithPets(!withPets)}
          />
          <Button
            mode="contained"
            title="Actualizeaza profilul tau"
            onPress={copletePerfil}
          >
            {" "}
            ACTUALIZEAZA
          </Button>
          <Button mode="contained" title="LOG OUT" onPress={handleLogout}>
            {" "}
            LOGOUT
          </Button>
        </Stack>
      ) : (
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: "StartScreen" }],
        // })
        // navigation.navigate("StartScreen")
        <Text>asdasd</Text>
      )}
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  imput: {
    height: 55,
  },
});

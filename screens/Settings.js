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
import { emailValidator } from "../components/Login/helpers/emailValidator";

const Settings = () => {
  const navigation = useNavigation();
  const [driver, setDriver] = useState(null);
  const [authId, setAuthId] = useState();
  const [driverData, setDriverData] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [indicativ, setIndicativ] = useState();
  const [registerNumber, setRegisterNumber] = useState();
  const [model, setModel] = useState();
  const [colour, setColour] = useState();
  const [nonSmoker, setNonSmoker] = useState(true);
  const [bigLuggage, setBigLuggage] = useState(true);
  const [withPets, setWithPets] = useState(true);

  const emailError = emailValidator(email);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuthId(user.uid);
    } else {
      console.log("user isLogOut", user);
      navigation.navigate("StartScreen");
    }
  });

  const getDriverData = async () => {
    const driversRef = ref(db, `drivers/${authId}/`);
    const snapshot = await get(driversRef);
    const user = await snapshot.val();
    if (user) {
      setName(user.name);
      setSurname(user.surname);
      setPhone(user.phone);
      setEmail(user.email);
      setIndicativ(user.indicativ);
      setRegisterNumber(user.registerNumber);
      setModel(user.model);
      setColour(user.colour);
      setNonSmoker(user.nonSmoker);
      setBigLuggage(user.bigLuggage);
      setWithPets(user.withPets);
    }
  };

  useEffect(() => {
    getDriverData();
  }, [authId]);

  const copletePerfil = () => {
    if (emailError) {
      alert(emailError);
    } else {
      const driverRef = ref(db, `drivers/${authId}/`);
      const newData = {
        name: name,
        surname: surname,
        phone: phone,
        email: email,
        indicativ: indicativ,
        registerNumber: registerNumber,
        model: model,
        colour: colour,
        nonSmoker: nonSmoker,
        bigLuggage: bigLuggage,
        withPets: withPets,
      };

      update(driverRef, newData)
        .then((data) => console.log("driver Updated"))
        .catch((err) => console.error(err));
      alert("ACTUALIZARE CORECTA");
    }
  };

  return (
    <ScrollView>
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
          leading={() => <Foundation name="telephone" size={24} color="grey" />}
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={styles.imput}
          label="email"
          leading={() => (
            <MaterialIcons name="alternate-email" size={24} color="black" />
          )}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
        <TextInput
          style={styles.imput}
          label="Indicativ"
          leading={() => <AntDesign name="idcard" size={24} color="black" />}
          value={indicativ}
          onChangeText={(text) => setIndicativ(text)}
        />
        <TextInput
          autoCapitalize="characters"
          style={styles.imput}
          label="Nr. de Inmatriculare"
          leading={(props) => <AntDesign name="car" size={24} color="black" />}
          value={registerNumber}
          onChangeText={(text) => setRegisterNumber(text)}
        />
        <TextInput
          autoCapitalize="characters"
          style={styles.imput}
          label="Modelul masinii"
          leading={(props) => <AntDesign name="car" size={24} color="black" />}
          value={model}
          onChangeText={(text) => setModel(text)}
        />
        <TextInput
          autoCapitalize="characters"
          style={styles.imput}
          label="Culoarea masinii"
          leading={(props) => <AntDesign name="car" size={24} color="black" />}
          value={colour}
          onChangeText={(text) => setColour(text)}
        />
        <ListItem
          title="Fumatori"
          trailing={
            <Switch
              value={nonSmoker}
              onValueChange={() => setNonSmoker(!nonSmoker)}
            />
          }
          onPress={() => setNonSmoker(!nonSmoker)}
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
      </Stack>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  imput: {
    height: 55,
  },
});

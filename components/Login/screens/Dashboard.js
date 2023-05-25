import React, { useEffect, useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import { db } from "../../../firebase";
import { ref, onValue, set } from "firebase/database";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { auth } from "../../../firebase";

export default function Dashboard({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;

  const [driver, setDriver] = useState();
  const [name, setName] = useState();

  const getDriver = () => {
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;

      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
      const uid = user.uid;
    }
    setName(user?.displayName);
    const driversRef = ref(db, "drivers");
    onValue(driversRef, (snapshot) => {
      const tmpArray = [];

      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();

        tmpArray.push({ id: childKey, ...childData });
      });
      if (tmpArray && user) {
        const actualDriver = tmpArray.find((driver) => driver.id === user.uid);
        setDriver(actualDriver);
      }
    });
  };
  useEffect(() => {
    getDriver();
  }, []);

  function handlerLogout() {
    setDriver("");
    signOut(auth).then(() => {
      console.log("signed out", user, driver);
    });
    navigation.reset({
      index: 0,
      routes: [{ name: "StartScreen" }],
    });
  }

  console.log("driver", user);

  return (
    <Background>
      <Logo />
      <Header>{driver ? driver.name : ""}</Header>
      <Paragraph>
        Asteapta sa fii AUTORIZAT de MaroviTaxi. Contacteaza telefonic
        dispeceratul.
      </Paragraph>
      <Button mode="outlined" onPress={handlerLogout}>
        Logout
      </Button>

      {driver?.state === "online" && navigation.navigate("Settings")}
    </Background>
  );
}

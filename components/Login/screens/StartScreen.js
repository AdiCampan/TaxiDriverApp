import { React, useEffect, useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import { auth } from "../../../firebase";

export default function StartScreen({ navigation }) {
  const [user, setUser] = useState(auth.currentUser);

  // const getUser = () => {
  //   actualUser = ;
  //   setUser(actualUser);
  // };

  // useEffect(() => {
  //   getUser;
  // }, [user]);
  console.log(user);

  return (
    <Background>
      <Logo />
      {/* <Header>Login Template</Header>
      <Paragraph>
        The easiest way to start with your amazing application.
      </Paragraph> */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        Sign Up
      </Button>
    </Background>
  );
}

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import Orders from "./screens/Orders";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import Order from "./components/Order";
// import LogIn from "./components/LogIn";
import LoginScreen from "./components/Login/screens/LoginScreen";
import StartScreen from "./components/Login/screens/StartScreen";
import RegisterScreen from "./components/Login/screens/RegisterScreen";
import ResetPasswordScreen from "./components/Login/screens/ResetPasswordScreen";
import Dashboard from "./components/Login/screens/Dashboard";
import Settings from "./screens/Settings";

const HomeStackNavigator = createNativeStackNavigator();
const OrderStackNavigator = createNativeStackNavigator();
function HomeStack() {
  return (
    <HomeStackNavigator.Navigator
      initialRouteName="StartScreen"
      screenOptions={{ headerShown: false }}
    >
      <HomeStackNavigator.Screen name="StartScreen" component={StartScreen} />
      <HomeStackNavigator.Screen name="LoginScreen" component={LoginScreen} />
      <HomeStackNavigator.Screen
        name="RegisterScreen"
        component={RegisterScreen}
      />
      <HomeStackNavigator.Screen name="Settings" component={Settings} />
      <HomeStackNavigator.Screen name="Dashboard" component={Dashboard} />
      <HomeStackNavigator.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />

      <HomeStackNavigator.Screen name="Home" component={HomeScreen} />
    </HomeStackNavigator.Navigator>
  );
}
function OrdersStack() {
  return (
    <OrderStackNavigator.Navigator initialRouteName="Orders">
      <OrderStackNavigator.Screen name="Orders" component={Orders} />
      <OrderStackNavigator.Screen name="Order" component={Order} />
    </OrderStackNavigator.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveTintColor: "purple",
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="OrdersStack"
        component={OrdersStack}
        options={{
          tabBarLabel: "Comenzi",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="hand-stop-o" size={24} color="black" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Setari",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

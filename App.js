import { Button, Text } from "react-native";
// import Profil from "./Profil";
// import List from "./List";
//
import HomeScreen from './screens/HomeScreen';
import AddInterventionScreen from './screens/AddInterventionScreen';
import ExportScreen from './screens/ExportScreen';
//
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import HomeScreen from "./HomeScreen";
// import ProfileScreen from "./ProfileScreen";
// import List from "./List";
import { createStaticNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
// import Calcul from "./Calcul";
// import Details from "./Details";
// import GamePickNames from "./game/GamePickNames";
// import GameBoard from "./game/GameBoard";
const TabNavigator = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: "L'interventions",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      },
    },
    Add: {
      screen: AddInterventionScreen,
      options: {
        title: "Ajouter",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle" size={size} color={color} />
        ),
      },
    },
    Export: {
      screen: ExportScreen,
      options: {
        title: "Export PDF/Excel",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="document-text" size={size} color={color} />
        ),
      },
    }
  },
/////



  initialRouteName: "Home",
  screenOptions: {
    tabBarActiveTintColor: "#11CAA0",
    tabBarInactiveTintColor: "gray",
    headerStyle: { backgroundColor: "#11CAA0" },
    headerTintColor: "#fff",
    headerTitleAlign: "center",
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    MainTabs: {
      screen: TabNavigator,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
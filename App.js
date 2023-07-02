import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import AppSplashScreen from "./screens/splashScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import store from "./redux/store";
import { Provider } from "react-redux";

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAppIsReady(true);
    }, 3000);
  }, []);

  return appIsReady ? (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Catch a Bus" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaView>
  ) : (
    <AppSplashScreen />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
});

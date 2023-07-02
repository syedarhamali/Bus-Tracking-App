import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Location from "expo-location";
import { addPickUpLocation } from "../../redux/store/actions/PickUpActions";
import { useDispatch } from "react-redux";
import RBSheet from "react-native-raw-bottom-sheet";
import LocationTracker from "../../components/locationTracker";
import { firebaseDb } from "../../firebase/init";
import { collection, onSnapshot, query } from "firebase/firestore";
import AnimatedButton from "../../components/UI/animatedButtons";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const [buses,setBuses] = useState([])
  const [locationCords, setlocationCords] = useState({
    latitude: 0.92392,
    longitude: 0.92392,
    latitudeDelta: 100,
    longitudeDelta: 100,
  });
  const [searchResults, setSearchResults] = useState();
  const [locationGranted, setlocationGranted] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const q = query(collection(firebaseDb, "buses"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const busesData = [];
      querySnapshot.forEach((doc) => {
        busesData.push(doc.data());
      });
      console.log("running")
      setBuses(busesData);
    });

    return () => {
      // Unsubscribe from the real-time updates when the component unmounts
      unsubscribe();
    };
  }, []);

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
    let latitudeDelta = 0.001;
    let longitudeDelta = 0.001;
    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});
    setlocationCords({ latitude, longitude, latitudeDelta, longitudeDelta });
    setlocationGranted(true);
  }

  // function searchLocation(query) {
  //   try {
  //     const options = {
  //       method: "GET",
  //       headers: {
  //         accept: "application/json",
  //         Authorization: "fsq34gc/yKyBdZkNfXX3BXp9IhG26f3TQrvukFhlyrhJr9E=",
  //       },
  //     };

  //     fetch(
  //       `https://api.foursquare.com/v3/places/search?query=${query}&ll=${locationCords.latitude}%2C${locationCords.longitude}&radius=100000&sort=DISTANCE`,
  //       options
  //     )
  //       .then((response) => response.json())
  //       .then((response) => setSearchResults(response.results))
  //       .catch((err) => console.error(err));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  // const ItemView = ({ item }) => {
  //   const { longitude, latitude } = item.geocodes.main;
  //   const setLocation = () => {
  //     setlocationCords({ ...locationCords, latitude, longitude });
  //     setlocationGranted(true);
  //     setSearchResults("");
  //     setlocationGranted(true);
  //   };
  //   return (
  //     <View style={{ paddingTop: 15, margin: 1, color: "white" }}>
  //       <Text style={{ margin: 2, padding: 1 }} onPress={() => setLocation()}>
  //         {item.name}
  //         {" " + item.location.formatted_address}
  //       </Text>
  //     </View>
  //   );
  // };
  // const navigateToDropOff = () => {
  //   locationGranted ? navigation.navigate("DropOffLocation") : getLocation();
  //   dispatch(addPickUpLocation(locationCords));
  // };
  return (
    <>
      <View>
        <LocationTracker />
        <MapView style={styles.map} initialRegion={locationCords}>
          {locationGranted && (
            <Marker
              coordinate={locationCords}
              title={"your PickUp Location"}
              description={"confirm pickup??"}
            />
          )}
          {buses?.map((item, index) => {
            return (
              <Marker
                coordinate={{
                  latitude: item?.latitude,
                  longitude: item?.longitude,
                  latitudeDelta: 100,
                  longitudeDelta: 100,
                }}
                key={index}
                title={"Bus"}
                description={"confirm pickup??"}
              />
            );
          })}
        </MapView>

        <Text style={styles.searchInput}>
          <AnimatedButton title="Next Bus in 01:00 minutes" color="blue" />
          <AnimatedButton title={`Total Buses:${buses?.length} `} color="green" />
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: 0,
          left: 20,
        }}
      >
        <Button title="OPEN BOTTOM SHEET" onPress={() => this.RBSheet.open()} />
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={300}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          dragFromTopOnly={true}
        >
          <Text>abc</Text>
          {/* <YourOwnComponent /> */}
        </RBSheet>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  list: {
    position: "absolute",
    width: "100%",
    top: 45,
    zIndex: 3,
    color: "white",
    backgroundColor: "black",
  },
  searchInput: {
    position: "absolute",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 0,
    width: "100%",
    paddingLeft: 6,
    paddingRight: 10,
    color: "white",
    height: "8%",
  },
});

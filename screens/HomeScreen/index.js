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
    latitude: 24.8873273,
    longitude: 67.19873,
    latitudeDelta: 100,
    longitudeDelta: 100,
  });
  const [busStops, setBusStops] = useState([]);
  const [locationGranted, setlocationGranted] = useState(false);
  

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const findBusStops = async () => {
      const query = "bus"; // Modify the query based on your specific needs

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "fsq34gc/yKyBdZkNfXX3BXp9IhG26f3TQrvukFhlyrhJr9E=", // Replace with your Foursquare API access token
        },
      };

      fetch(
        `https://api.foursquare.com/v3/places/nearby?ll=24.8873273%2C67.1987343&&fields=distance%2Cname%2Clocation&&query=${query}`,
        options
      )
        .then((response) => response.json())
        .then((response) => {
          const busStopsData = response?.results;
          console.log(response.results);
          // busStopData = response.results;
          let shortestDistance = Number.MAX_VALUE;
          let nearestStop = null;

          for (const busStop of busStopsData) {
            const distance = busStop.distance;
            if (distance < shortestDistance) {
              shortestDistance = distance;
              nearestStop = busStop;
            }
          }
          busStopsData.sort((a, b) => a.distance - b.distance);
          setBusStops(busStopsData);
        })
        .catch((err) => console.error(err));
    };

    findBusStops();
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
    const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{item.distance   /1000} kilometers</Text>
        </View>
      </View>
    );
  return (
    <>
      <View>
        <LocationTracker />
        <MapView style={styles.map} initialRegion={locationCords}>
          {locationGranted && (
            <Marker
              coordinate={locationCords}
              title={"current Location"}
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
          <AnimatedButton title={`Nearest stand: ${busStops[0]?.distance / 1000}km`} color="blue" />
          <AnimatedButton
            title={`Total Buses:${buses?.length} `}
            color="green"
          />
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
        <Button title="Search Buses" style={{flex: 1}} onPress={() => this.RBSheet.open()} />
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
          <View>
            {busStops?.length > 0 && (
              <FlatList
                data={busStops}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
              />
            )}
          </View>
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    top: 0,
    width: "100%",
    paddingLeft: 6,
    paddingRight: 10,
    color: "white",
    height: "8%",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  distanceBadge: {
    backgroundColor: "blue",
    borderRadius: 10,
    padding: 5,
  },
  distanceText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

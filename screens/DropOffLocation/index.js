import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, TextInput, FlatList, Text } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addDropOffLocation } from '../../redux/store/actions/DropOffActions'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'



export default function DropOffLocation({ navigation }) {
    const dispatch = useDispatch()
    const { latitude, longitude } = useSelector(state => state.pickUpReducers.pickupLocation)

    const [locationCords, setlocationCords] = useState({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
    });
    const [searchResults, setSearchResults] = useState()
    const [locationGranted, setlocationGranted] = useState(false);
    const [isDropOff, setisDropOff] = useState(false);

    async function searchLocation(query) {
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'fsq34gc/yKyBdZkNfXX3BXp9IhG26f3TQrvukFhlyrhJr9E='
                }
            }


            fetch(`https://api.foursquare.com/v3/places/search?query=${query}&ll=${locationCords.latitude}%2C${locationCords.longitude}&radius=100000&sort=DISTANCE`, options)
                .then(response => response.json())
                .then(response => setSearchResults(response.results))
                .catch(err => console.error(err));

        } catch (err) {
            console.error(err);
        }
    }

    const navigateToRideSelection = () => {
        dispatch(addDropOffLocation(locationCords))
        navigation.navigate('RideSelection')
    }

    const ItemView = ({ item }) => {
        const { longitude, latitude } = item.geocodes.main;
        function setLocation() {
            setlocationCords({ ...locationCords, latitude, longitude });
            setlocationGranted(true)
            setSearchResults('')
            setisDropOff(true)
        }
        return (
            <View style={{ paddingTop: 13,margin: 1, color: 'white' }} >
                <Text style={{margin: 2,padding: 1}} onPress={() => setLocation()}>
                    {item.name}
                    {(' ' +item.location.formatted_address)}
                </Text>
            </View>
        );
    };
    return (
        <View>
            <MapView style={styles.map} region={locationCords}>
                {locationGranted &&
                    <Marker
                        coordinate={locationCords}
                        title={'DropOff Location'}
                        description={'Confirm DropOff??'}
                    />
                }
            </MapView>
            <TextInput
                style={styles.searchInput}
                onChangeText={(query) => searchLocation(query)}
                placeholder={'Search Location'}
                placeholderTextColor="white"
            />
            <FlatList
                style={styles.list}
                data={searchResults}
                renderItem={ItemView}
            />
            <TouchableOpacity style={styles.button}>
                {isDropOff ?
                    <FontAwesome.Button name="road" backgroundColor="black" onPress={navigateToRideSelection}>
                        Confirm Ride!
                    </FontAwesome.Button>
                    :
                    <FontAwesome.Button name="road" backgroundColor="black">
                        Add DropOff!
                    </FontAwesome.Button>
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%'
    },
    searchInput: {
        position: 'absolute',
        top: 0,
        width: '100%',
        paddingLeft: 6,
        paddingRight: 10,
        backgroundColor: '#000000',
        color: 'white',
        height: '8%'
    },
    button: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    list: {
        position: 'absolute',
        width: "100%",
        top: 40,
        zIndex: 3,
        color: 'white',
        backgroundColor: 'black',
    }
})

import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View, TouchableHighlight, Button, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import MapView, { Marker, Polyline } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons'
import { getPreciseDistance } from 'geolib';
import { RadioButton } from 'react-native-paper';

export default function RideSelection() {
  const pickupLocation = useSelector(state => state.pickUpReducers.pickupLocation)
  const dropOffLocation = useSelector(state => state.dropOffReducers.dropOffLocation)
  const [checked, setChecked] = useState('');
  const coordinates = [{
    ...pickupLocation, latitudeDelta: 0.2,
    longitudeDelta: 0.3,
  }, {
    ...dropOffLocation
  }]
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    calculatePreciseDistance()
  }, [])

  const calculatePreciseDistance = () => {
    const totalDistance = getPreciseDistance(
      { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
      { latitude: dropOffLocation.latitude, longitude: dropOffLocation.longitude }
    );
    setDistance(totalDistance);

  };
  const startRide = () =>{
    checked ? alert("looking for a driver.....") : alert("please select ride first")
  }
  

  return (
    <View>
      <MapView region={coordinates[0]} style={{ height: '60%', width: '100%' }}>
        <Marker
          coordinate={coordinates[0]}
          title={'your PickUp Location'}
          description={'confirm pickup??'}
        />
        <Marker
          coordinate={coordinates[1]}
          title={'your DropOff Location'}
          description={'confirm dropoff??'}

        />
        {/* <MapViewDirections
            origin={coordinates[0]}
            destination={coordinates[1]}
            // apikey={GOOGLE_API_KEY} // insert your API Key here
            strokeWidth={4}
            strokeColor="#111111"
          /> */}
        <Polyline
          coordinates={coordinates}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={['#7F0000']}
          strokeWidth={6}
        />
      </MapView>
      <Text style={{ fontSize: 20, marginLeft: 30, padding: 5 }}>Total Distance is {distance} meters or {distance / 1000}kM</Text>
      <View style={styles.rates}>
        <View style={styles.items}>
          <Ionicons name='car-sport' style={styles.icons}></Ionicons >
          <Text> Luxury Car </Text>
        </View>
        <View style={styles.radio}>
          <Text> Rs. {Math.round((distance / 1000) * 110)} </Text>
          <RadioButton
            value='luxury'
            status={checked === 'luxury' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('luxury')}
          />
        </View>
      </View>
      <View style={styles.rates}>
        <View style={styles.items}>
          <Ionicons name='car' style={styles.icons}></Ionicons >
          <Text> Car Fare </Text>
        </View>
        <View style={styles.radio}>
          <Text> Rs. {Math.round((distance / 1000) * 80)} </Text>
          <RadioButton
            value='car'
            status={checked === 'car' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('car')}
          />
        </View>
      </View>
      <View style={styles.rates}>
        <View style={styles.items}>
          <Ionicons name='bicycle' style={styles.icons}></Ionicons >
          <Text> Bike Fare </Text>
        </View>
        <View style={styles.radio}>
          <Text> Rs. {Math.round((distance / 1000) * 50)} </Text>
          <RadioButton
            value='bike'
            status={checked === 'bike' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('bike')}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.rates} onPress={startRide}>
        <View style={styles.button}>
          <Ionicons name='walk' style={[styles.icons,{marginLeft: 0}]}></Ionicons>
          <Text>Chalo!</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  rates: {
    margin: 5,
    borderRadius: 5,
    padding: 10,
    fontSize: 20,
    borderColor: 'grey',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  items: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  radio: {
    display: 'flex',
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  icons: {
    fontSize: 20,
    marginLeft: 20,
    marginRight: 20
  },
  button: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

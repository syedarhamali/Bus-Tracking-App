import { useEffect } from "react";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import { firebaseUpdateBusLocation } from "../../firebase/utils";

const LocationTracker = () => {
  useEffect(() => {
    let isMounted = true;
    const calculateDistance = (dx, dy, dz) => {
      // Assuming constant acceleration, calculate the distance based on change in acceleration
      const acceleration = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const time = 0.1; // Time interval in seconds
      const distance = (acceleration * time * time) / 2; // Distance = (acceleration * time^2) / 2
      return distance;
    };

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }
      const sendLocation = async (longitude,latitude) => {
        const res = await firebaseUpdateBusLocation("buses", 'oCOCDYJzvtcQRfg4TyvC', {
          longitude: longitude,
          latitude: latitude,
        });
      };

      let initialAcceleration = null;
      let lastAcceleration = null;
      let distanceCovered = 0;

      Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;

        if (initialAcceleration === null) {
          initialAcceleration = { x, y, z };
        }

        if (lastAcceleration === null) {
          lastAcceleration = { x, y, z };
        } else {
          const dx = x - lastAcceleration.x;
          const dy = y - lastAcceleration.y;
          const dz = z - lastAcceleration.z;

          // Calculate the magnitude of change in acceleration
          const accelerationMagnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Set a threshold for movement detection
          const movementThreshold = 0.05; // Adjust this threshold according to your needs

          if (accelerationMagnitude > movementThreshold) {
            // Calculate the distance covered based on approximate device movement
            const distance = calculateDistance(dx, dy, dz);
            distanceCovered += distance;
            console.log("distance cOVERED", distanceCovered);
            if (distanceCovered >= 0.05) {
              // Adjust this distance threshold according to your needs
              Location.getCurrentPositionAsync({})
                .then((location) => {
                  console.log(location);
                  const { latitude, longitude } = location.coords;
                  sendLocation(longitude,latitude);
                  distanceCovered = 0;
                })
                .catch((error) => {
                  console.log("Error getting location:", error);
                });
            }
          }

          lastAcceleration = { x, y, z };
        }
      });

      Accelerometer.setUpdateInterval(800); // Set the accelerometer update interval in milliseconds
    };

    startLocationTracking();

    return () => {
      isMounted = false;
      Accelerometer.removeAllListeners();
    };
  }, []);

  return null; // or return any UI component if needed
};

export default LocationTracker;

import React, { useState } from "react";
import {
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

const AnimatedButton = ({ title, color }) => {
  const [animation] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.spring(animation, {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const handleRelease = () => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    backgroundColor: color,
    width: Dimensions.get("window").width * 0.5, // Set width to 50% of the window width
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressOut={handleRelease}
      activeOpacity={1}
      style={styles.button}
    >
      <Animated.View style={[styles.buttonContainer, animatedStyle]}>
        <Text style={styles.buttonText}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
    alignItems: "center",
    padding: 10,
    margin: 20
  },
  buttonContainer: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AnimatedButton;

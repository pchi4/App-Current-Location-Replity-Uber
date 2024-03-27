import React, { useEffect, useRef, useState } from "react";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  AnimatedRegion,
} from "react-native-maps";
import { StyleSheet, View, Dimensions, Text, Platform } from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  Accuracy,
  LocationAccuracy,
} from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
const { width, height } = Dimensions.get("window");

export default function App() {
  const aspect = width / height;
  const latitude_delta = 0.0922;
  const longitude_delta = latitude_delta * aspect;
  const mapRef = useRef();
  const markerRef = useRef();
  const [location, setLocation] = useState({
    currentLocation: {
      latitude: -12.9166572,
      longitude: -38.458494,
    },
    destinationCords: { latitude: 0, longitude: 0 },
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: -12.9166572,
      longitude: -38.458494,
      latitudeDelta: latitude_delta,
      longitudeDelta: longitude_delta,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });
  const [initialRegion, setInitialRegion] = useState(null);
  const [destination, setDestination] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [count, setCount] = useState(0);
  const [newArray, setNewArray] = useState(null);
  // const [coordinates, setCoordinates] = useState([
  //   { latitude: 37.3317876, longitude: -122.0054812 },
  //   { latitude: 37.771707, longitude: -122.4053769 },
  // ]);

  const requestPermision = async () => {
    try {
      const { granted } = await requestForegroundPermissionsAsync();
      if (granted) {
        const { coords } = await getCurrentPositionAsync();
        const { latitude, longitude, heading } = coords;

        animate(latitude, longitude);
        updateState({
          heading: heading,
          currentLocation: { latitude, longitude },
          coordinates: new AnimatedRegion({
            latitude,
            longitude,
            latitudeDelta: latitude_delta,
            longitudeDelta: longitude_delta,
          }),
        });
      }
    } catch (error) {}
  };

  const updateState = (data) => setLocation((value) => ({ ...value, ...data }));

  const { coordinates, currentLocation, destinationCords } = location;

  useEffect(() => {
    requestPermision();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      requestPermision();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      coordinates.timing(newCoordinate).start();
    }
  };

  // useEffect(() => {
  //   watchPositionAsync(
  //     {
  //       accuracy: LocationAccuracy.Highest,
  //       timeInterval: 3000,
  //       distanceInterval: 1,
  //     },
  //     (response) => {
  //       let cood = [...coordinates];
  //       cood.push(response.coords);
  //       setLocation({ coordinates: cood });
  //       // console.log(response);
  //       // setLocation({
  //       //   coordinates: [...location.coordinates, ...response.coords],
  //       // });
  //     }
  //   );
  // }, []);

  // console.log(location);

  // setInterval(() => {
  //   setCount((count += 1));
  // }, 500);

  // console.log(count);

  const requestFromApi = async () => {
    try {
      let res = await fetch(
        `https://maps.google.com/maps/api/geocode/json?key=AIzaSyDvNypCJVAfgPJ1nmrqZvz25wSbW3JOjUc&address=${location.latitude},${location.longitude}&sensor=false`,
        { method: "POST" }
      );
      const resJson = await res.json();
      // console.log(resJson);
      return resJson;
    } catch (error) {}
  };

  const onPressAddress = (details) => {
    console.log(details);
    updateState({
      destinationCords: {
        latitude: details?.geometry?.location.lat,
        longitude: details?.geometry?.location.lng,
      },
    });
    moveToLocation(
      details?.geometry?.location.lat,
      details?.geometry?.location.lng
    );
  };

  // const formarterArray = () => {
  //   const newArray = location?.coordinates.slice(1, -1);
  //   setNewArray(newArray);
  // };

  // useEffect(() => {
  //   if (location?.coordinates > 0) {
  //     const formated = location?.coordinates.slice(1, -1);
  //     console.log({ formated });
  //     setNewArray(formated);
  //   }
  // }, []);

  // useEffect(() => {
  //   setCount((count += 1));
  // }, [count]);
  // // console.log(newArray);

  const moveToLocation = async (latitude, longitude) => {
    try {
      await mapRef?.current?.animateRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        2000
      );
    } catch (error) {}
  };

  const onReady = (result) => {
    console.log(result);
  };

  const onMapPress = (e) => {
    let coord = [...coordinates];

    coord.push(e.nativeEvent.coordinate);

    // setCoordinates(coord);
    setLocation({ coordinates: coord });
    // setLocation({ coordinates: [...location, ...e.nativeEvent.coordinate] });
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          // provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={styles.map}
          initialRegion={
            {
              ...currentLocation,
              latitudeDelta: latitude_delta,
              longitudeDelta: longitude_delta,
            } ?? { latitude: 0, longitude: 0 }
          }
          onPress={(value) => onMapPress(value)}
        >
          {/* <Marker
            title="Sou o current"
            coordinate={{
              latitude: location?.coordinates[0]?.latitude ?? 0,
              longitude: location?.coordinates[0]?.longitude ?? 0,
            }}
          /> */}

          <Marker.Animated
            ref={markerRef}
            coordinate={coordinates ?? { latitude: 0, longitude: 0 }}
          />

          {Object.keys(destinationCords).length > 0 && (
            <Marker coordinate={destinationCords} />
          )}

          {Object.keys(destinationCords).length > 0 && (
            <MapViewDirections
              origin={currentLocation}
              destination={destinationCords}
              optimizeWaypoints={true}
              apikey="AIzaSyDvNypCJVAfgPJ1nmrqZvz25wSbW3JOjUc"
              strokeColor="purple"
              strokeWidth={4}
              language="pt-br"
              onReady={(result) =>
                mapRef.current.fitToCoordinates(result?.coordinates, {
                  edgePadding: {
                    right: width / 10,
                    bottom: height / 10,
                    left: width / 10,
                    top: height / 10,
                  },
                })
              }
              mode="DRIVING"
              onStart={(params) => {
                console.log(
                  `Started routing between "${params.origin}" and "${params.destination}"`
                );
              }}
            />
          )}

          {/* {location?.coordinates?.map((coordinate, index) => (
            <Marker key={index + 1} coordinate={coordinate} />
          ))} */}
          <Marker
            coordinate={currentLocation ?? { latitude: 0, longitude: 0 }}
          />

          <Marker
            title="Destino final"
            coordinate={
              destinationCords ?? {
                latitude: 0,
                longitude: 0,
              }
            }
          />
        </MapView>
      )}
      <View
        style={{
          position: "absolute",
          paddingTop: 40,
          paddingHorizontal: 10,
          width: "100%",
        }}
      >
        <Text style={{ fontSize: 20 }}>Selecione um local</Text>
        <View
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            paddingTop: 80,

            paddingHorizontal: 12,
            left: 0,
            right: 0,
            // top: 100,
          }}
        >
          <GooglePlacesAutocomplete
            placeholder="Search"
            fetchDetails={true}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              onPressAddress(details);
            }}
            query={{
              key: "AIzaSyDvNypCJVAfgPJ1nmrqZvz25wSbW3JOjUc",
              language: "pt-br",
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f0f0f0",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

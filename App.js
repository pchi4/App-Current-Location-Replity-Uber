import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Dimensions, Text } from "react-native";
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
  const [location, setLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [destination, setDestination] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [count, setCount] = useState(0);
  const [newArray, setNewArray] = useState(null);
  const [coordinates, setCoordinates] = useState([
    { latitude: 37.3317876, longitude: -122.0054812 },
    { latitude: 37.771707, longitude: -122.4053769 },
  ]);

  const aspect = width / height;
  const latitude_delta = 0.0922;
  const longitude_delta = latitude_delta * aspect;
  const mapRef = useRef();

  useEffect(() => {
    const requestPermision = async () => {
      try {
        const { granted } = await requestForegroundPermissionsAsync();
        if (granted) {
          const currentPosition = await getCurrentPositionAsync();
          setLocation({ coordinates: new Array(currentPosition.coords) });
          setOrigin({
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
          });
          setInitialRegion({
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      } catch (error) {}
    };
    requestPermision();
  }, []);

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

    let newArray = [...result.coordinates];

    setLocation({ coordinates: newArray });
    mapRef.current.fitToCoordinates(result?.coordinates, {
      edgePadding: {
        right: width / 10,
        bottom: height / 10,
        left: width / 10,
        top: height / 10,
      },
    });
  };

  const onMapPress = (e) => {
    let coord = [...coordinates];

    coord.push(e.nativeEvent.coordinate);

    // setCoordinates(coord);
    setLocation({ coordinates: coord });
    // setLocation({ coordinates: [...location, ...e.nativeEvent.coordinate] });
  };

  // console.log(coordinates);

  // useEffect(() => {
  //   requestFromApi();
  // }, [location]);

  // useEffect(() => {
  //   // if (!newArray) return;
  //   // console.log(newArray);
  //   // setNewArray(newArray?.slice(1, -1));
  //   intervalChange;
  // }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          paddingTop: 40,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 20 }}>Selecione um local</Text>
      </View>
      <View
        style={{
          flex: 0.5,
          paddingTop: 100,
          padding: 20,
          backgroundColor: "transparent",
          zIndex: 1,
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
      {location && (
        <MapView
          // provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          onPress={(value) => onMapPress(value)}
        >
          {/* <Marker
            title="Sou o current"
            coordinate={{
              latitude: location?.coordinates[0]?.latitude ?? 0,
              longitude: location?.coordinates[0]?.longitude ?? 0,
            }}
          /> */}

          <MapViewDirections
            origin={location?.coordinates[0]}
            destination={
              location?.coordinates[location?.coordinates.length - 1]
            }
            waypoints={
              location?.coordinates.length > 2
                ? location?.coordinates.slice(1, -1)
                : undefined
            }
            optimizeWaypoints={true}
            apikey="AIzaSyDvNypCJVAfgPJ1nmrqZvz25wSbW3JOjUc"
            strokeColor="purple"
            strokeWidth={4}
            language="pt-br"
            onReady={onReady}
            mode="DRIVING"
            onStart={(params) => {}}
          />

          {/* {location?.coordinates?.map((coordinate, index) => (
            <Marker key={index + 1} coordinate={coordinate} />
          ))} */}
          <Marker coordinate={location?.coordinates[0]} />

          <Marker
            title="Destino final"
            coordinate={location?.coordinates[coordinates.length - 1]}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    height: "100%",
  },
});

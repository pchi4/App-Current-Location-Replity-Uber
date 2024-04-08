import React, { useEffect, useRef, useState } from "react";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  AnimatedRegion,
} from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Platform,
  Image,
  LogBox,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { requestForegroundPermissionsAsync } from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
const { width, height } = Dimensions.get("window");
import { useGetCurrentLocation } from "../../hooks";
import { styles } from "./style";

export const Map = ({ navigation }) => {
  const aspect = width / height;
  const latitude_delta = 0.0922;
  const longitude_delta = latitude_delta * aspect;
  const mapRef = useRef();
  const markerRef = useRef();
  const [isGranted, setIsGranted] = useState(false);
  const [location, setLocation] = useState({
    currentLocation: { latitude: -12.9166572, longitude: -38.458494 },
    destinationCords: { latitude: 0, longitude: 0 },
    isLoading: true,
    coordinate: new AnimatedRegion({
      ...currentLocation,
      latitudeDelta: latitude_delta,
      longitudeDelta: longitude_delta,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });

  const [cards] = useState([
    { title: "Casa", icon: require("@/assets/house.png") },
    { title: "Trabalho", icon: require("@/assets/work.png") },
    { title: "Favoritos", icon: require("@/assets/house.png") },
  ]);

  const { getCurrentLocation } = useGetCurrentLocation();

  const updateState = (data) => setLocation((value) => ({ ...value, ...data }));

  async function requestPermision() {
    try {
      const { granted } = await requestForegroundPermissionsAsync();
      setIsGranted(granted);
      if (granted) {
        const { latitude, longitude, heading } = await getCurrentLocation();

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
    } catch (error) {
      console.log(error);
    }
  }

  const { coordinates, currentLocation, destinationCords, isLoading, heading } =
    location;

  useEffect(() => {
    requestPermision();
    centerlizeCurrentPosition();
    LogBox.ignoreLogs([
      "MapViewDirections Error: Error on GMAPS route request",
    ]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      requestPermision();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef?.current) {
        markerRef?.current?.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      coordinates?.timing(newCoordinate).start();
    }
  };

  function moveToLocation(latitude, longitude) {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: latitude_delta,
      longitudeDelta: longitude_delta,
    });
  }

  const onPressAddress = (details) => {
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

  const centerlizeCurrentPosition = async () => {
    try {
      const { latitude, longitude, heading } = await getCurrentLocation();
      moveToLocation(latitude, longitude);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isGranted) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Por favor, ative a localizaçao para o funcionamento do app.</Text>
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View style={styles.container}>
        {location && (
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              ...currentLocation,
              latitudeDelta: latitude_delta,
              longitudeDelta: longitude_delta,
            }}
          >
            {coordinates && (
              <Marker.Animated ref={markerRef} coordinate={coordinates} />
            )}

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
                onStart={(params) => {
                  console.log(
                    `Started routing between "${params.origin}" and "${params.destination}"`
                  );
                }}
              />
            )}

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
        <View style={styles.containerSearch}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.titel}>Selecione um local</Text>
            <View
              style={{
                backgroundColor: "#89C2D9",
                padding: 12,
                borderRadius: 20,
              }}
            >
              <TouchableOpacity onPress={() => navigation.popToTop()}>
                <Image
                  width={24}
                  alt="a"
                  source={require("@/assets/arrow_back.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              paddingHorizontal: 12,
              paddingTop: 10,
            }}
          >
            <GooglePlacesAutocomplete
              placeholder="Digite um endereço..."
              fetchDetails={true}
              styles={{ backgroundColor: "#FFFFFF" }}
              onPress={(data, details = null) => {
                onPressAddress(details);
              }}
              query={{
                key: "AIzaSyDvNypCJVAfgPJ1nmrqZvz25wSbW3JOjUc",
                language: "pt-br",
              }}
              debounce={300}
            />
          </View>
          <View style={styles.containerCards}>
            {cards.map((card, idx) => (
              <View key={idx} style={styles.card}>
                <Image
                  source={card.icon}
                  width={32}
                  style={{ marginRight: 6 }}
                />
                <Text style={{ color: "#2A6F97" }}>{card.title}</Text>
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={centerlizeCurrentPosition}>
          <View style={styles.button}>
            <Image
              style={{ alignItems: "center" }}
              source={require("@/assets/gps_fixed.png")}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

import React, { useEffect, useRef } from "react";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  MapCallout,
} from "react-native-maps";
import {
  View,
  Text,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { Error } from "../../components/Erro";
import { styles } from "./style";
import { Info } from "../../components/Info";
import { useFocusEffect } from "@react-navigation/native";
import { useRequestPermission } from "./hooks/useRequestPermission";

export const Map = ({ navigation }) => {
  const mapRef = useRef();
  const markerRef = useRef();
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  const {
    requestPermision,
    updateState,
    updateStateDetails,
    isGranted,
    location,
    latitude_delta,
    width,
    height,
    longitude_delta,
    detailsCoord,
  } = useRequestPermission();

  const { coordinates, currentLocation, destinationCords } = location;

  useFocusEffect(
    React.useCallback(() => {
      requestPermision();
      centerlizeCurrentPosition();
    }, [])
  );

  useEffect(() => {
    if (destinationCords.latitude >= 0) {
      mapRef.current?.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: latitude_delta,
          longitudeDelta: longitude_delta,
        },
      });
    }
  }, [currentLocation.latitude]);

  useEffect(() => {
    const interval = setInterval(() => {
      requestPermision();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const animate = (latitude: any, longitude: any) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef?.current) {
        markerRef?.current?.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      coordinates?.timing(newCoordinate).start();
    }
  };

  function moveToLocation(
    latitude: number | undefined,
    longitude: number | undefined
  ) {
    mapRef?.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: latitude_delta,
      longitudeDelta: longitude_delta,
    });
  }

  const onReadyFit = (result: object) => {
    result.legs.forEach((element: IDeailsCoord) => {
      updateStateDetails({
        distance: element.distance,
        duration: element.duration,
        end_address: element.end_address,
        start_address: element.start_address,
      });
    });

    mapRef.current?.fitToCoordinates(result?.coordinates, {
      edgePadding: {
        right: width / 10,
        bottom: height / 10,
        left: width / 10,
        top: height / 10,
      },
    });
  };

  const onPressAddress = (details: GooglePlaceDetail | null) => {
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

  const centerlizeCurrentPosition = () => {
    moveToLocation(currentLocation.latitude, currentLocation.longitude);
  };

  if (!isGranted) {
    return <Error handleGoHome={() => navigation.navigate("Home")} />;
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
              <Marker.Animated ref={markerRef} coordinate={coordinates}>
                {!Object.values(destinationCords).includes(0) && (
                  <MapCallout tooltip={false}>
                    <Info
                      distance={detailsCoord?.duration?.text}
                      address={detailsCoord.start_address}
                    />
                  </MapCallout>
                )}
              </Marker.Animated>
            )}

            {!Object.values(destinationCords).includes(0) && (
              <Marker coordinate={destinationCords}>
                <MapCallout tooltip={false}>
                  <Info
                    distance={detailsCoord?.distance?.text}
                    address={detailsCoord.end_address}
                  />
                </MapCallout>
              </Marker>
            )}

            {!Object.values(destinationCords).includes(0) && (
              <MapViewDirections
                origin={currentLocation}
                destination={destinationCords}
                optimizeWaypoints={true}
                apikey={apiKey}
                strokeColor="purple"
                strokeWidth={4}
                language="pt-br"
                onReady={(result) => onReadyFit(result)}
                onStart={(params) => {
                  console.log(
                    `Started routing between "${params.origin}" and "${params.destination}"`
                  );
                }}
                onError={(value) => Alert.alert("Rota não encontrada", value)}
              />
            )}
          </MapView>
        )}
        <View style={styles.containerSearch}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 16,
            }}
          >
            <Text style={styles.titel}>Selecione um endereço</Text>
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
                key: apiKey,
                language: "pt-br",
                components: "country:br",
              }}
              debounce={300}
            />
          </View>
        </View>
        <TouchableOpacity onPress={centerlizeCurrentPosition}>
          <View style={styles.button}>
            <Image
              style={{ alignItems: "center" }}
              source={require("../../assets/gps_fixed.png")}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

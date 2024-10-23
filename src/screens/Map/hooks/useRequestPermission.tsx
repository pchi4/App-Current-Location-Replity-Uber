import { requestForegroundPermissionsAsync } from "expo-location";
import { useGetCurrentLocation } from "../../../hooks";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import { AnimatedRegion } from "react-native-maps";

interface IObject {
  text: string;
  value: number | null;
}

interface IDeailsCoord {
  distance: IObject;
  durantion: IObject;
  end_address: string;
  start_address: string;
}

export const useRequestPermission = () => {
  const { width, height } = Dimensions.get("window");
  const aspect = width / height;
  const latitude_delta = 0.0922;
  const longitude_delta = latitude_delta * aspect;

  const [isGranted, setIsGranted] = useState<boolean | null>(null);
  const [location, setLocation] = useState({
    currentLocation: { latitude: -12.9166572, longitude: -38.458494 },
    destinationCords: { latitude: 0, longitude: 0 },
    isLoading: true,
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
  const [detailsCoord, setDetailsCoord] = useState<IDeailsCoord>({
    distance: { text: "", value: null },
    duration: { text: "", value: null },
    end_address: "",
    start_address: "",
  });

  const { getCurrentLocation } = useGetCurrentLocation();

  const updateState = (data) => setLocation((value) => ({ ...value, ...data }));
  const updateStateDetails = (data) =>
    setDetailsCoord((value) => ({ ...value, ...data }));
  async function requestPermision() {
    try {
      const { granted } = await requestForegroundPermissionsAsync();

      setIsGranted(granted);
      if (granted) {
        const { latitude, longitude, heading } = await getCurrentLocation();

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

  return {
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
  };
};

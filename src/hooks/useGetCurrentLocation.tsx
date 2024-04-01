import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  Accuracy,
  LocationAccuracy,
} from "expo-location";

export const useGetCurrentLocation = () => {
  const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
      watchPositionAsync(
        {
          accuracy: LocationAccuracy.Highest,
          timeInterval: 3000,
          distanceInterval: 1,
        },
        (response) => {
          const cords = {
            latitude: response.coords.latitude,
            longitude: response.coords.longitude,
            heading: response?.coords?.heading,
          };
          resolve(cords);
        },
        (error: any) => {
          reject(error);
        }
      );
    });

  return {
    getCurrentLocation,
  };
};

import { StyleSheet, Platform, StatusBar } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  articleFirst: {
    flex: 2,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    alignItems: "center",
  },
  articleSecond: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 12,
  },
  textHome: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 8,
    backgroundColor: "white",
  },
  textButton: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
});

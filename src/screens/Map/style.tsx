import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f0f0f0",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  containerSearch: {
    position: "absolute",
    paddingTop: 40,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#FAFAFACC",
    shadowColor: "0 2 2 0 #0000001A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    width: width / 4,
    shadowColor: "black",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  titel: {
    fontSize: 20,
    color: "#012A4A",
    fontWeight: "600",
    marginLeft: 12,
  },
  containerCards: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    position: "absolute",
    borderRadius: 10,
    width: "15%",
    padding: 16,
    top: width / 0.6,
    right: 20,
    backgroundColor: "#FFFFFF",
  },
});

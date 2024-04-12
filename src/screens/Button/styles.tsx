import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  header: {
    marginTop: height / 10,
    flex: 3,
    alignItems: "center",
  },
  titleTip: {
    color: "#F29E18",
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 8,
  },
  textTitle: {
    textAlign: "center",
    fontSize: 18,
  },
  footer: {
    flex: 1,
    marginHorizontal: 8,
  },
  card: {
    width: "100%",
    padding: 12,
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
  },

  textButton: {
    color: "#F1FAEE",
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#EB435A",
    justifyContent: "center",
    alignItems: "center",
    marginTop: height / 10,
  },
  containerProgress: { marginVertical: 14 },
  titleInfo: { fontWeight: "bold", fontSize: 20, textAlign: "center" },
  titleLocal: { color: "#012A4A", fontSize: 20, fontWeight: "bold" },
  titleFato: { fontSize: 18 },
});

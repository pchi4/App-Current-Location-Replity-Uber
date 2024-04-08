import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.articleFirst}>
        <Text>Home</Text>
      </View>
      <View style={styles.articleSecond}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Map")}
        >
          <Text style={styles.textButton}>Go to Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  articleFirst: {
    flex: 2,
    backgroundColor: "gray",
  },
  articleSecond: {
    flex: 1,
    backgroundColor: "yellow",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 12,
  },
  textButton: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
});

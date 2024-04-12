import { View, SafeAreaView, TouchableOpacity, Text } from "react-native";

export const Home = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24 }}>Bem vindo</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 8 }}>
          <TouchableOpacity
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 30,
              backgroundColor: "blue",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={() => navigation.navigate("Button")}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Butão de Emergência
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 8 }}>
          <TouchableOpacity
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 30,
              backgroundColor: "#EB435A",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={() => navigation.navigate("Map")}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Ir para o mapa
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

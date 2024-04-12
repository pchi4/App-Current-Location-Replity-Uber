import { View, Text, TouchableOpacity } from "react-native";

export interface IProps {
  handleGoHome: () => void;
}

export const Error = ({ handleGoHome }: IProps) => {
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 8,
      }}
    >
      <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          Por favor, ative a localização para o funcionamento do app.
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={{ marginHorizontal: 16 }}>
          <TouchableOpacity
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 30,
              backgroundColor: "blue",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 16,
            }}
            onPress={handleGoHome}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Ir para Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

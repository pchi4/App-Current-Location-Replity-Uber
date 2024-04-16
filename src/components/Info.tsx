import { View, Text } from "react-native";

export const Info = ({ distance, address }) => {
  return (
    <View
      style={{
        padding: 4,
        flexDirection: "row",
        justifyContent: "flex-start",
        width: 140,
      }}
    >
      <View style={{ backgroundColor: "black" }}>
        <Text
          numberOfLines={1}
          style={{
            color: "white",
            padding: 6,
            maxWidth: 60,
          }}
        >
          {distance}
        </Text>
      </View>
      <View
        style={{
          padding: 4,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            color: "black",
          }}
        >
          {address}
        </Text>
      </View>
    </View>
  );
};

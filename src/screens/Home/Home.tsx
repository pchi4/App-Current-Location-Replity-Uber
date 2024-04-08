import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { styles } from "./style";
const { width, height } = Dimensions.get("window");

export const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.articleFirst}>
        <Image
          style={{ width: width / 1, height: width / 1 }}
          source={require("@/assets/conversa.png")}
        />
      </View>
      <Text style={styles.textHome}>
        Compartilhe sua localização e tenho acesso real de sua posição no mundo.
      </Text>

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

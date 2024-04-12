import { useRef } from "react";
import { View, SafeAreaView, TouchableOpacity, Text } from "react-native";

import CircularProgress from "react-native-circular-progress-indicator";

import { styles } from "./styles";

export const Button = ({ navigation }) => {
  const progressRef = useRef();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textTitle}>
          Você está prestes a registrar uma ocorrência de emergência de{" "}
        </Text>
        <Text style={styles.titleTip}>VIOLÊNCIA CONTRA A MULHER</Text>
        <View style={styles.card}>
          <Text style={styles.titleFato}>Local do Fato</Text>
          <Text style={styles.titleLocal}>Avenida Eng. Santana Cabo</Text>
        </View>

        <View style={styles.containerProgress}>
          <Text style={styles.titleInfo}>
            Sua ocorencia será registrada automaticamente em{" "}
          </Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <CircularProgress
            title="segundos"
            titleColor="#012A4A"
            ref={progressRef}
            value={0}
            radius={100}
            maxValue={10}
            initialValue={10}
            progressValueColor={"#012A4A"}
            activeStrokeColor={"#FB8500"}
            activeStrokeWidth={15}
            inActiveStrokeWidth={15}
            duration={10000}

            //   onAnimationComplete={() => alert("time out")}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => progressRef?.current.pause()}
        >
          <Text style={styles.textButton}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

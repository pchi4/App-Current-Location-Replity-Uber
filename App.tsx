import React from "react";
import "react-native-gesture-handler";
import { StatusBar } from "react-native";

import { Routes } from "./src/routes";

export default function App() {
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <Routes />
    </>
  );
}

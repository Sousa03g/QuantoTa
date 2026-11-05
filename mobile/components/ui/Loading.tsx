import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Carregando placares..." }: LoadingProps) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0D1117", padding: 20 }}>
      <ActivityIndicator size="large" color="#00C853" />
      <Text style={{ marginTop: 12, color: "#8B949E", fontSize: 13, fontWeight: "500" }}>
        {message}
      </Text>
    </View>
  );
}

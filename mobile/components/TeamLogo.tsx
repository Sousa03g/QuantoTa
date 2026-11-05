import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";

interface TeamLogoProps {
  url?: string;
  name: string;
  size?: number;
}

export function TeamLogo({ url, name, size = 28 }: TeamLogoProps) {
  const initials = (name || "?").substring(0, 2).toUpperCase();

  if (url && url.startsWith("http")) {
    return (
      <Image
        source={{ uri: url }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="contain"
      />
    );
  }

  // Fallback avatar
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#21262D",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#F0F6FC", fontSize: size * 0.4, fontWeight: "700" }}>
        {initials}
      </Text>
    </View>
  );
}

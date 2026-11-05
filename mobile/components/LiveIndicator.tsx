import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

interface LiveIndicatorProps {
  label?: string;
}

export function LiveIndicator({ label = "AO VIVO" }: LiveIndicatorProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Animated.View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#FF4444",
          opacity: pulseAnim,
        }}
      />
      <Text style={{ color: "#FF4444", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>
        {label}
      </Text>
    </View>
  );
}

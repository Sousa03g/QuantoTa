import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  loading = false,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (variant === "secondary") return "#21262D";
    if (variant === "ghost") return "transparent";
    return "#00C853";
  };

  const getTextColor = () => {
    if (variant === "ghost") return "#8B949E";
    if (variant === "secondary") return "#F0F6FC";
    return "#0D1117";
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={{ color: getTextColor(), fontWeight: "700", fontSize: 14 }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

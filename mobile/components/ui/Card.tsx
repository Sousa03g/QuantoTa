import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", style, ...props }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: "#161B22",
          borderColor: "#21262D",
          borderWidth: 1,
          borderRadius: 12,
          padding: 14,
        },
        style,
      ]}
      className={className}
      {...props}
    >
      {children}
    </View>
  );
}

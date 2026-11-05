import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

interface LeagueHeaderProps {
  id: number;
  name: string;
  country?: string;
  flag?: string;
}

export function LeagueHeader({ id, name, country, flag = "🏆" }: LeagueHeaderProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/league/${id}`)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 6,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ fontSize: 16 }}>{flag}</Text>
        <Text
          style={{
            color: "#8B949E",
            fontSize: 12,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {name} {country ? `• ${country}` : ""}
        </Text>
      </View>
      <Text style={{ color: "#30363D", fontSize: 14 }}>›</Text>
    </TouchableOpacity>
  );
}

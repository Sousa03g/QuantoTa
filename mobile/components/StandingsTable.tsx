import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { TeamLogo } from "./TeamLogo";
import { Standing } from "@/services/leagues";

interface StandingsTableProps {
  standings: Standing[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  if (!standings || standings.length === 0) {
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ color: "#8B949E", fontSize: 13 }}>Classificação não disponível.</Text>
      </View>
    );
  }

  const getRankColor = (rank: number) => {
    if (rank <= 4) return "#00C853"; // Libertadores / Champions
    if (rank <= 6) return "#4488FF"; // Sul-Americana / Europa
    if (rank >= standings.length - 3) return "#FF4444"; // Rebaixamento
    return "#8B949E";
  };

  return (
    <View style={{ backgroundColor: "#161B22", borderRadius: 12, margin: 16, overflow: "hidden" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderBottomWidth: 1,
          borderBottomColor: "#21262D",
        }}
      >
        <Text style={{ width: 28, color: "#8B949E", fontSize: 11, fontWeight: "700" }}>#</Text>
        <Text style={{ flex: 1, color: "#8B949E", fontSize: 11, fontWeight: "700" }}>TIME</Text>
        <Text style={{ width: 28, textAlign: "center", color: "#8B949E", fontSize: 11, fontWeight: "700" }}>J</Text>
        <Text style={{ width: 28, textAlign: "center", color: "#8B949E", fontSize: 11, fontWeight: "700" }}>V</Text>
        <Text style={{ width: 34, textAlign: "center", color: "#8B949E", fontSize: 11, fontWeight: "700" }}>SG</Text>
        <Text style={{ width: 30, textAlign: "center", color: "#F0F6FC", fontSize: 11, fontWeight: "800" }}>P</Text>
      </View>

      {/* Rows */}
      {standings.map((item) => (
        <TouchableOpacity
          key={item.id || item.team.id}
          activeOpacity={0.7}
          onPress={() => router.push(`/team/${item.team.id}`)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderBottomWidth: 1,
            borderBottomColor: "#21262D",
          }}
        >
          <Text style={{ width: 28, color: getRankColor(item.rank), fontSize: 13, fontWeight: "700" }}>
            {item.rank}
          </Text>

          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TeamLogo url={item.team.logo} name={item.team.name} size={22} />
            <Text numberOfLines={1} style={{ color: "#F0F6FC", fontSize: 13, fontWeight: "600", flex: 1 }}>
              {item.team.name}
            </Text>
          </View>

          <Text style={{ width: 28, textAlign: "center", color: "#8B949E", fontSize: 12 }}>
            {item.played}
          </Text>
          <Text style={{ width: 28, textAlign: "center", color: "#8B949E", fontSize: 12 }}>
            {item.wins}
          </Text>
          <Text style={{ width: 34, textAlign: "center", color: "#8B949E", fontSize: 12 }}>
            {item.goalDiff > 0 ? `+${item.goalDiff}` : item.goalDiff}
          </Text>
          <Text style={{ width: 30, textAlign: "center", color: "#F0F6FC", fontSize: 13, fontWeight: "700" }}>
            {item.points}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

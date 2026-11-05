import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getPlayerById } from "@/services/players";
import { Image } from "expo-image";
import { Loading } from "@/components/ui/Loading";

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = parseInt(id, 10);

  const { data: player, isLoading } = useQuery({
    queryKey: ["player", playerId],
    queryFn: () => getPlayerById(playerId),
  });

  if (isLoading || !player) {
    return <Loading message="Carregando perfil do jogador..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1117" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Player Header */}
        <View
          style={{
            alignItems: "center",
            padding: 24,
            backgroundColor: "#161B22",
            borderBottomWidth: 1,
            borderBottomColor: "#21262D",
          }}
        >
          {player.photo ? (
            <Image
              source={{ uri: player.photo }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#21262D",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#F0F6FC", fontSize: 32, fontWeight: "800" }}>
                {player.name.charAt(0)}
              </Text>
            </View>
          )}

          <Text style={{ color: "#F0F6FC", fontSize: 22, fontWeight: "800", marginTop: 14 }}>
            {player.name}
          </Text>
          <Text style={{ color: "#00C853", fontSize: 14, fontWeight: "600", marginTop: 2 }}>
            {player.position} {player.number ? `• #${player.number}` : ""}
          </Text>
        </View>

        {/* Player Stats / Info */}
        <View style={{ padding: 16 }}>
          <View
            style={{
              backgroundColor: "#161B22",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#21262D",
              overflow: "hidden",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 14, borderBottomWidth: 1, borderBottomColor: "#21262D" }}>
              <Text style={{ color: "#8B949E", fontSize: 13 }}>Nacionalidade</Text>
              <Text style={{ color: "#F0F6FC", fontSize: 13, fontWeight: "600" }}>{player.nationality}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 14, borderBottomWidth: 1, borderBottomColor: "#21262D" }}>
              <Text style={{ color: "#8B949E", fontSize: 13 }}>Idade</Text>
              <Text style={{ color: "#F0F6FC", fontSize: 13, fontWeight: "600" }}>{player.age ? `${player.age} anos` : "N/D"}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 14 }}>
              <Text style={{ color: "#8B949E", fontSize: 13 }}>Clube Atual</Text>
              <Text style={{ color: "#00C853", fontSize: 13, fontWeight: "700" }}>{player.team?.name || "Sem clube"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

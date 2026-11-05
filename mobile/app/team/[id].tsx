import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getTeamById } from "@/services/teams";
import { TeamLogo } from "@/components/TeamLogo";
import { PlayerCard } from "@/components/PlayerCard";
import { Loading } from "@/components/ui/Loading";
import { useFavorites } from "@/hooks/useFavorites";

export default function TeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const teamId = parseInt(id, 10);
  const { isFavoriteTeam, toggleFavoriteTeam } = useFavorites();
  const [activeTab, setActiveTab] = useState<"elenco" | "info">("elenco");

  const { data: team, isLoading } = useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getTeamById(teamId),
  });

  const isFav = isFavoriteTeam(teamId);

  if (isLoading || !team) {
    return <Loading message="Carregando informações do time..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1117" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Team Header */}
        <View
          style={{
            alignItems: "center",
            padding: 24,
            backgroundColor: "#161B22",
            borderBottomWidth: 1,
            borderBottomColor: "#21262D",
          }}
        >
          <TeamLogo url={team.logo} name={team.name} size={70} />
          <Text style={{ color: "#F0F6FC", fontSize: 22, fontWeight: "800", marginTop: 12 }}>
            {team.name}
          </Text>
          <Text style={{ color: "#8B949E", fontSize: 13, marginTop: 2 }}>
            {team.country} {team.founded ? `• Fundado em ${team.founded}` : ""}
          </Text>

          <TouchableOpacity
            onPress={() => toggleFavoriteTeam(teamId)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: isFav ? "#00C853" : "#21262D",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              marginTop: 14,
            }}
          >
            <Text style={{ fontSize: 14 }}>⭐</Text>
            <Text style={{ color: isFav ? "#0D1117" : "#F0F6FC", fontWeight: "700", fontSize: 13 }}>
              {isFav ? "Favoritado" : "Favoritar"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: "row", marginHorizontal: 16, marginTop: 12, borderBottomWidth: 1, borderBottomColor: "#21262D" }}>
          <TouchableOpacity
            onPress={() => setActiveTab("elenco")}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === "elenco" ? "#00C853" : "transparent",
            }}
          >
            <Text style={{ color: activeTab === "elenco" ? "#00C853" : "#8B949E", fontWeight: "700" }}>
              Elenco
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("info")}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === "info" ? "#00C853" : "transparent",
            }}
          >
            <Text style={{ color: activeTab === "info" ? "#00C853" : "#8B949E", fontWeight: "700" }}>
              Informações
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab content */}
        {activeTab === "elenco" ? (
          <View style={{ marginTop: 8 }}>
            {team.players && team.players.length > 0 ? (
              team.players.map((p) => (
                <PlayerCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  position={p.position}
                  number={p.number}
                  photo={p.photo}
                />
              ))
            ) : (
              <View style={{ padding: 24, alignItems: "center" }}>
                <Text style={{ color: "#8B949E", fontSize: 13 }}>Nenhum jogador cadastrado no momento.</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={{ padding: 16 }}>
            <View style={{ backgroundColor: "#161B22", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#21262D" }}>
              <Text style={{ color: "#F0F6FC", fontSize: 15, fontWeight: "700", marginBottom: 8 }}>Estádio / Arena</Text>
              <Text style={{ color: "#8B949E", fontSize: 13 }}>{team.venue || "Não informado"}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

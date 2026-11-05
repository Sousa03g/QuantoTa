import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useLeagueDetails, useStandings } from "@/hooks/useLeague";
import { StandingsTable } from "@/components/StandingsTable";
import { Loading } from "@/components/ui/Loading";
import { useFavorites } from "@/hooks/useFavorites";

export default function LeagueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const leagueId = parseInt(id, 10);
  const { data: league, isLoading: loadingLeague } = useLeagueDetails(leagueId);
  const { data: standings, isLoading: loadingStandings } = useStandings(leagueId);
  const { isFavoriteLeague, toggleFavoriteLeague } = useFavorites();
  const [activeTab, setActiveTab] = useState<"tabela" | "artilharia">("tabela");

  const isFav = isFavoriteLeague(leagueId);

  if (loadingLeague) {
    return <Loading message="Carregando informações da liga..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1117" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* League banner */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            backgroundColor: "#161B22",
            borderBottomWidth: 1,
            borderBottomColor: "#21262D",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#F0F6FC", fontSize: 20, fontWeight: "800" }}>
              {league?.name || "Liga"}
            </Text>
            <Text style={{ color: "#8B949E", fontSize: 13, marginTop: 2 }}>
              {league?.country} • Temporada {league?.season || "2024"}
            </Text>
          </View>

          <TouchableOpacity onPress={() => toggleFavoriteLeague(leagueId)}>
            <Text style={{ fontSize: 24 }}>{isFav ? "⭐" : "☆"}</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: "row", marginHorizontal: 16, marginTop: 12, borderBottomWidth: 1, borderBottomColor: "#21262D" }}>
          <TouchableOpacity
            onPress={() => setActiveTab("tabela")}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === "tabela" ? "#00C853" : "transparent",
            }}
          >
            <Text style={{ color: activeTab === "tabela" ? "#00C853" : "#8B949E", fontWeight: "700" }}>
              Classificação
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("artilharia")}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === "artilharia" ? "#00C853" : "transparent",
            }}
          >
            <Text style={{ color: activeTab === "artilharia" ? "#00C853" : "#8B949E", fontWeight: "700" }}>
              Artilharia
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "tabela" ? (
          loadingStandings ? (
            <Loading message="Carregando tabela..." />
          ) : (
            <StandingsTable standings={standings || []} />
          )
        ) : (
          <View style={{ padding: 24, alignItems: "center" }}>
            <Text style={{ color: "#8B949E", fontSize: 13 }}>Artilharia será atualizada ao final da rodada.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

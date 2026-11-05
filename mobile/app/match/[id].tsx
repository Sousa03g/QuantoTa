import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMatchDetails } from "@/hooks/useMatches";
import { ScoreBoard } from "@/components/ScoreBoard";
import { MatchTimeline } from "@/components/MatchTimeline";
import { Loading } from "@/components/ui/Loading";

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: match, isLoading } = useMatchDetails(id);
  const [activeTab, setActiveTab] = useState<"eventos" | "stats" | "escalacao">("eventos");

  if (isLoading || !match) {
    return <Loading message="Carregando detalhes do jogo..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1117" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Score Board */}
        <ScoreBoard match={match} />

        {/* Navigation Tabs */}
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#21262D",
            marginHorizontal: 16,
            marginBottom: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("eventos")}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === "eventos" ? "#00C853" : "transparent",
            }}
          >
            <Text
              style={{
                color: activeTab === "eventos" ? "#00C853" : "#8B949E",
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              Eventos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("stats")}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === "stats" ? "#00C853" : "transparent",
            }}
          >
            <Text
              style={{
                color: activeTab === "stats" ? "#00C853" : "#8B949E",
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              Estatísticas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("escalacao")}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === "escalacao" ? "#00C853" : "transparent",
            }}
          >
            <Text
              style={{
                color: activeTab === "escalacao" ? "#00C853" : "#8B949E",
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              Escalações
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab contents */}
        {activeTab === "eventos" && (
          <MatchTimeline events={match.events || []} />
        )}

        {activeTab === "stats" && (
          <View style={{ padding: 16 }}>
            {[
              { label: "Posse de Bola", home: "58%", away: "42%", homeVal: 58, awayVal: 42 },
              { label: "Finalizações", home: "12", away: "7", homeVal: 12, awayVal: 7 },
              { label: "Chutes no Gol", home: "5", away: "3", homeVal: 5, awayVal: 3 },
              { label: "Escanteios", home: "6", away: "4", homeVal: 6, awayVal: 4 },
              { label: "Faltas", home: "11", away: "14", homeVal: 11, awayVal: 14 },
              { label: "Cartões Amarelos", home: "2", away: "3", homeVal: 2, awayVal: 3 },
            ].map((stat, idx) => (
              <View key={idx} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ color: "#F0F6FC", fontWeight: "700", fontSize: 13 }}>{stat.home}</Text>
                  <Text style={{ color: "#8B949E", fontSize: 12, fontWeight: "500" }}>{stat.label}</Text>
                  <Text style={{ color: "#F0F6FC", fontWeight: "700", fontSize: 13 }}>{stat.away}</Text>
                </View>
                <View style={{ flexDirection: "row", height: 6, backgroundColor: "#21262D", borderRadius: 3, overflow: "hidden" }}>
                  <View style={{ flex: stat.homeVal, backgroundColor: "#00C853" }} />
                  <View style={{ flex: stat.awayVal, backgroundColor: "#FF6B35" }} />
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "escalacao" && (
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ color: "#00C853", fontWeight: "700", fontSize: 14 }}>{match.homeTeam.name}</Text>
              <Text style={{ color: "#FF6B35", fontWeight: "700", fontSize: 14 }}>{match.awayTeam.name}</Text>
            </View>
            <View style={{ backgroundColor: "#161B22", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#21262D" }}>
              <Text style={{ color: "#8B949E", fontSize: 13, textAlign: "center" }}>
                Formações táticas e jogadores titulares disponíveis 1 hora antes da partida.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

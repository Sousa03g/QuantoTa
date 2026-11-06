import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMatchDetails } from "@/hooks/useMatches";
import { ScoreBoard } from "@/components/ScoreBoard";
import { MatchTimeline } from "@/components/MatchTimeline";
import { Loading } from "@/components/ui/Loading";
import { translateStatName } from "@/utils/statTranslations";

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: match, isLoading } = useMatchDetails(id);
  const [activeTab, setActiveTab] = useState<"eventos" | "stats" | "escalacao">("eventos");

  if (isLoading || !match) {
    return <Loading message="Carregando detalhes do jogo..." />;
  }

  const stats = match.statistics || [];
  const lineups = match.lineups;

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
              Eventos ({match.events?.length || 0})
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

        {/* Real Statistics Tab */}
        {activeTab === "stats" && (
          <View style={{ padding: 16 }}>
            {stats.length > 0 ? (
              stats.map((stat, idx) => {
                const total = (stat.homeValue || 1) + (stat.awayValue || 1);
                const homePercent = Math.max(10, Math.min(90, Math.round(((stat.homeValue || 1) / total) * 100)));
                const awayPercent = 100 - homePercent;

                return (
                  <View key={idx} style={{ marginBottom: 14 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                      <Text style={{ color: "#F0F6FC", fontWeight: "700", fontSize: 13 }}>{stat.home}</Text>
                      <Text style={{ color: "#8B949E", fontSize: 12, fontWeight: "600" }}>
                        {translateStatName(stat.name)}
                      </Text>
                      <Text style={{ color: "#F0F6FC", fontWeight: "700", fontSize: 13 }}>{stat.away}</Text>
                    </View>
                    <View style={{ flexDirection: "row", height: 6, backgroundColor: "#21262D", borderRadius: 3, overflow: "hidden" }}>
                      <View style={{ flex: homePercent, backgroundColor: "#00C853" }} />
                      <View style={{ flex: awayPercent, backgroundColor: "#FF6B35" }} />
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={{ backgroundColor: "#161B22", padding: 24, borderRadius: 12, borderWidth: 1, borderColor: "#21262D", alignItems: "center" }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>📊</Text>
                <Text style={{ color: "#F0F6FC", fontSize: 14, fontWeight: "700", textAlign: "center" }}>
                  Estatísticas em processamento
                </Text>
                <Text style={{ color: "#8B949E", fontSize: 12, textAlign: "center", marginTop: 4 }}>
                  Os dados de posse de bola, chutes e faltas serão atualizados conforme a partida se desenvolve.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Real Lineups Tab */}
        {activeTab === "escalacao" && (
          <View style={{ padding: 16 }}>
            {lineups && (lineups.home?.players?.length > 0 || lineups.away?.players?.length > 0) ? (
              <View>
                {/* Formations banner */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "#161B22",
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#21262D",
                  }}
                >
                  <View>
                    <Text style={{ color: "#00C853", fontWeight: "800", fontSize: 13 }}>{match.homeTeam.name}</Text>
                    {lineups.home?.formation && (
                      <Text style={{ color: "#8B949E", fontSize: 11, marginTop: 2 }}>Esquema: {lineups.home.formation}</Text>
                    )}
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: "#FF6B35", fontWeight: "800", fontSize: 13 }}>{match.awayTeam.name}</Text>
                    {lineups.away?.formation && (
                      <Text style={{ color: "#8B949E", fontSize: 11, marginTop: 2 }}>Esquema: {lineups.away.formation}</Text>
                    )}
                  </View>
                </View>

                {/* Home Starting 11 */}
                <Text style={{ color: "#00C853", fontSize: 13, fontWeight: "700", marginBottom: 8, letterSpacing: 0.5 }}>
                  TITULARES — {match.homeTeam.name}
                </Text>
                <View style={{ backgroundColor: "#161B22", borderRadius: 10, padding: 8, marginBottom: 16, borderWidth: 1, borderColor: "#21262D" }}>
                  {(lineups.home?.players || []).filter((p) => !p.substitute).map((p, idx) => (
                    <View key={idx} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6, borderBottomWidth: idx === 10 ? 0 : 1, borderBottomColor: "#21262D" }}>
                      <Text style={{ color: "#00C853", fontWeight: "800", width: 28, fontSize: 12 }}>
                        {p.shirtNumber || "•"}
                      </Text>
                      <Text style={{ color: "#F0F6FC", fontSize: 13, flex: 1, fontWeight: "600" }}>{p.name}</Text>
                      {p.position && (
                        <Text style={{ color: "#8B949E", fontSize: 11, backgroundColor: "#21262D", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                          {p.position}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>

                {/* Away Starting 11 */}
                <Text style={{ color: "#FF6B35", fontSize: 13, fontWeight: "700", marginBottom: 8, letterSpacing: 0.5 }}>
                  TITULARES — {match.awayTeam.name}
                </Text>
                <View style={{ backgroundColor: "#161B22", borderRadius: 10, padding: 8, marginBottom: 16, borderWidth: 1, borderColor: "#21262D" }}>
                  {(lineups.away?.players || []).filter((p) => !p.substitute).map((p, idx) => (
                    <View key={idx} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6, borderBottomWidth: idx === 10 ? 0 : 1, borderBottomColor: "#21262D" }}>
                      <Text style={{ color: "#FF6B35", fontWeight: "800", width: 28, fontSize: 12 }}>
                        {p.shirtNumber || "•"}
                      </Text>
                      <Text style={{ color: "#F0F6FC", fontSize: 13, flex: 1, fontWeight: "600" }}>{p.name}</Text>
                      {p.position && (
                        <Text style={{ color: "#8B949E", fontSize: 11, backgroundColor: "#21262D", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                          {p.position}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={{ backgroundColor: "#161B22", padding: 24, borderRadius: 12, borderWidth: 1, borderColor: "#21262D", alignItems: "center" }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>📋</Text>
                <Text style={{ color: "#F0F6FC", fontSize: 14, fontWeight: "700", textAlign: "center" }}>
                  Escalações ainda não divulgadas
                </Text>
                <Text style={{ color: "#8B949E", fontSize: 12, textAlign: "center", marginTop: 4 }}>
                  As formações táticas oficiais são confirmadas pelas comissões técnicas cerca de 45 a 60 minutos antes do início.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

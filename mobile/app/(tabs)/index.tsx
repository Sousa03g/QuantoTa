import React, { useState } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from "react-native";
import { useMatchesByDate, useLiveMatches } from "@/hooks/useMatches";
import { MatchCard } from "@/components/MatchCard";
import { LeagueHeader } from "@/components/LeagueHeader";
import { Loading } from "@/components/ui/Loading";
import { getTodayDateString } from "@/utils/dateFormat";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const { data: matchesByLeague, isLoading, refetch, isRefetching } = useMatchesByDate(selectedDate);
  const { data: liveMatches } = useLiveMatches();

  // Generate 7 days pill list centered on today
  const baseDate = new Date();
  const datePills = [-2, -1, 0, 1, 2, 3, 4].map((offset) => {
    const d = offset >= 0 ? addDays(baseDate, offset) : subDays(baseDate, Math.abs(offset));
    const str = format(d, "yyyy-MM-dd");
    let label = format(d, "EEE", { locale: ptBR });
    if (offset === 0) label = "Hoje";
    else if (offset === -1) label = "Ontem";
    else if (offset === 1) label = "Amanhã";
    return { dateString: str, label, day: format(d, "d") };
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1117" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 }}>
        <View>
          <Text style={{ color: "#00C853", fontSize: 24, fontWeight: "900", letterSpacing: -0.5 }}>
            QuantoTa?
          </Text>
          <Text style={{ color: "#8B949E", fontSize: 12 }}>
            Placares ao vivo & estatísticas
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: "#161B22",
            borderWidth: 1,
            borderColor: "#21262D",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Date pills */}
      <View style={{ paddingVertical: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {datePills.map((p) => {
            const isSelected = p.dateString === selectedDate;
            return (
              <TouchableOpacity
                key={p.dateString}
                activeOpacity={0.7}
                onPress={() => setSelectedDate(p.dateString)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: isSelected ? "#00C853" : "#161B22",
                  borderWidth: 1,
                  borderColor: isSelected ? "#00C853" : "#21262D",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: isSelected ? "#0D1117" : "#F0F6FC",
                    fontSize: 12,
                    fontWeight: isSelected ? "700" : "500",
                    textTransform: "capitalize",
                  }}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Matches list */}
      {isLoading ? (
        <Loading message="Buscando partidas do dia..." />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#00C853" />
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {/* Live matches highlight if any */}
          {liveMatches && liveMatches.length > 0 && selectedDate === getTodayDateString() && (
            <View style={{ marginBottom: 12 }}>
              <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <Text style={{ color: "#FF4444", fontSize: 13, fontWeight: "800", letterSpacing: 0.5 }}>
                  🔴 EM ANDAMENTO AGORA
                </Text>
              </View>
              {liveMatches.map((group) =>
                group.matches.map((match) => (
                  <MatchCard key={`live-${match.id}`} match={match} />
                ))
              )}
            </View>
          )}

          {/* Grouped matches by league */}
          {matchesByLeague && matchesByLeague.length > 0 ? (
            matchesByLeague.map((group) => (
              <View key={group.league.id} style={{ marginBottom: 8 }}>
                <LeagueHeader
                  id={group.league.id}
                  name={group.league.name}
                  country={group.league.country}
                />
                {group.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </View>
            ))
          ) : (
            <View style={{ alignItems: "center", marginTop: 60, paddingHorizontal: 32 }}>
              <Text style={{ fontSize: 44, marginBottom: 12 }}>⚽</Text>
              <Text style={{ color: "#F0F6FC", fontSize: 16, fontWeight: "700", textAlign: "center" }}>
                Nenhum jogo agendado
              </Text>
              <Text style={{ color: "#8B949E", fontSize: 13, textAlign: "center", marginTop: 4 }}>
                Não há partidas registradas para a data selecionada.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useFavorites } from "@/hooks/useFavorites";
import { POPULAR_LEAGUES } from "@/constants/leagues";

const SAMPLE_TEAMS = [
  { id: 127, name: "Flamengo", country: "Brasil", league: "Brasileirão", logo: "F", color: "#006400" },
  { id: 529, name: "Barcelona", country: "Espanha", league: "La Liga", logo: "B", color: "#A50044" },
  { id: 121, name: "Palmeiras", country: "Brasil", league: "Brasileirão", logo: "P", color: "#1C6E3B" },
  { id: 33, name: "Manchester United", country: "Inglaterra", league: "Premier League", logo: "M", color: "#DA291C" },
];

export default function FavoritesScreen() {
  const { favoriteTeamIds, favoriteLeagueIds, toggleFavoriteTeam, toggleFavoriteLeague } = useFavorites();

  const favTeams = SAMPLE_TEAMS.filter((t) => favoriteTeamIds.includes(t.id));
  const favLeagues = POPULAR_LEAGUES.filter((l) => favoriteLeagueIds.includes(l.id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1117" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 }}>
        <Text style={{ color: "#F0F6FC", fontSize: 24, fontWeight: "800" }}>Favoritos</Text>
        <Text style={{ color: "#8B949E", fontSize: 12, marginTop: 2 }}>
          Acompanhe de perto seus times e campeonatos
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Teams Section */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ color: "#8B949E", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
            ⭐ Meus Times
          </Text>
        </View>

        {favTeams.length > 0 ? (
          favTeams.map((team) => (
            <TouchableOpacity
              key={team.id}
              activeOpacity={0.7}
              onPress={() => router.push(`/team/${team.id}`)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#161B22",
                borderWidth: 1,
                borderColor: "#21262D",
                borderRadius: 14,
                padding: 14,
                marginHorizontal: 16,
                marginVertical: 4,
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: team.color,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "800" }}>{team.logo}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: "#F0F6FC", fontSize: 15, fontWeight: "700" }}>{team.name}</Text>
                <Text style={{ color: "#8B949E", fontSize: 12, marginTop: 2 }}>
                  {team.league} • {team.country}
                </Text>
              </View>

              <TouchableOpacity onPress={() => toggleFavoriteTeam(team.id)}>
                <Text style={{ fontSize: 20 }}>⭐</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ padding: 16, alignItems: "center" }}>
            <Text style={{ color: "#8B949E", fontSize: 13 }}>Nenhum time favoritado ainda.</Text>
          </View>
        )}

        {/* Leagues Section */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ color: "#8B949E", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
            🏆 Minhas Ligas
          </Text>
        </View>

        {favLeagues.length > 0 ? (
          favLeagues.map((league) => (
            <TouchableOpacity
              key={league.id}
              activeOpacity={0.7}
              onPress={() => router.push(`/league/${league.id}`)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#161B22",
                borderWidth: 1,
                borderColor: "#21262D",
                borderRadius: 14,
                padding: 14,
                marginHorizontal: 16,
                marginVertical: 4,
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: "#21262D",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 22 }}>{league.flag}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: "#F0F6FC", fontSize: 15, fontWeight: "700" }}>{league.name}</Text>
                <Text style={{ color: "#8B949E", fontSize: 12, marginTop: 2 }}>{league.country}</Text>
              </View>

              <TouchableOpacity onPress={() => toggleFavoriteLeague(league.id)}>
                <Text style={{ fontSize: 20 }}>⭐</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ padding: 16, alignItems: "center" }}>
            <Text style={{ color: "#8B949E", fontSize: 13 }}>Nenhuma liga favoritada ainda.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

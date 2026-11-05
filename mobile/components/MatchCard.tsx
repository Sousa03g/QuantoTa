import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { TeamLogo } from "./TeamLogo";
import { LiveIndicator } from "./LiveIndicator";
import { isLive, isFinished, getStatusLabel } from "@/utils/scoreUtils";
import { formatMatchTime } from "@/utils/dateFormat";
import { Match } from "@/services/matches";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const isMatchLive = isLive(match.status);
  const isMatchFinished = isFinished(match.status);

  const homeScore = match.homeScore ?? (isMatchLive || isMatchFinished ? 0 : "-");
  const awayScore = match.awayScore ?? (isMatchLive || isMatchFinished ? 0 : "-");

  const homeWon = isMatchFinished && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWon = isMatchFinished && (match.awayScore ?? 0) > (match.homeScore ?? 0);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/match/${match.id}`)}
      style={{
        backgroundColor: "#161B22",
        borderColor: "#21262D",
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        marginHorizontal: 16,
        marginVertical: 6,
      }}
    >
      {/* Header status */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
        {isMatchLive ? (
          <LiveIndicator label={`AO VIVO • ${match.minute ?? 0}'`} />
        ) : (
          <Text style={{ color: "#8B949E", fontSize: 11, fontWeight: "600" }}>
            {isMatchFinished ? "ENCERRADO" : formatMatchTime(match.date)}
          </Text>
        )}
      </View>

      {/* Home team */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 3 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
          <TeamLogo url={match.homeTeam.logo} name={match.homeTeam.name} size={26} />
          <Text
            numberOfLines={1}
            style={{
              color: "#F0F6FC",
              fontSize: 14,
              fontWeight: homeWon ? "700" : "500",
              flex: 1,
            }}
          >
            {match.homeTeam.name}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: homeWon || isMatchLive ? "#00C853" : "#F0F6FC",
            minWidth: 24,
            textAlign: "right",
          }}
        >
          {homeScore}
        </Text>
      </View>

      {/* Away team */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 3 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
          <TeamLogo url={match.awayTeam.logo} name={match.awayTeam.name} size={26} />
          <Text
            numberOfLines={1}
            style={{
              color: "#F0F6FC",
              fontSize: 14,
              fontWeight: awayWon ? "700" : "500",
              flex: 1,
            }}
          >
            {match.awayTeam.name}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: awayWon || isMatchLive ? "#00C853" : "#F0F6FC",
            minWidth: 24,
            textAlign: "right",
          }}
        >
          {awayScore}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

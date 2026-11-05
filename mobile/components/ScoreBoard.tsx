import React from "react";
import { View, Text } from "react-native";
import { TeamLogo } from "./TeamLogo";
import { LiveIndicator } from "./LiveIndicator";
import { isLive, getStatusLabel } from "@/utils/scoreUtils";
import { Match } from "@/services/matches";

interface ScoreBoardProps {
  match: Match;
}

export function ScoreBoard({ match }: ScoreBoardProps) {
  const isMatchLive = isLive(match.status);

  return (
    <View
      style={{
        backgroundColor: "#161B22",
        padding: 20,
        margin: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#21262D",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        {/* Home Team */}
        <View style={{ alignItems: "center", width: 100 }}>
          <TeamLogo url={match.homeTeam.logo} name={match.homeTeam.name} size={54} />
          <Text
            numberOfLines={2}
            style={{
              color: "#F0F6FC",
              fontWeight: "700",
              fontSize: 13,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            {match.homeTeam.name}
          </Text>
        </View>

        {/* Score & Status */}
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: "#F0F6FC",
              fontSize: 34,
              fontWeight: "800",
              letterSpacing: 2,
            }}
          >
            {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
          </Text>

          <View style={{ marginTop: 6 }}>
            {isMatchLive ? (
              <LiveIndicator label={`${match.minute ?? 0}'`} />
            ) : (
              <Text style={{ color: "#8B949E", fontSize: 12, fontWeight: "600" }}>
                {getStatusLabel(match.status, match.minute)}
              </Text>
            )}
          </View>
        </View>

        {/* Away Team */}
        <View style={{ alignItems: "center", width: 100 }}>
          <TeamLogo url={match.awayTeam.logo} name={match.awayTeam.name} size={54} />
          <Text
            numberOfLines={2}
            style={{
              color: "#F0F6FC",
              fontWeight: "700",
              fontSize: 13,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            {match.awayTeam.name}
          </Text>
        </View>
      </View>
    </View>
  );
}

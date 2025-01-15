import TeamMemberCard from "@/components/myTeam/TeamMemberCard";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { WORKERS } from "@/dummies/DummyWorkers";
import { ScrollView } from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MyTeamScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        {WORKERS.map((worker, key) => {
          return <TeamMemberCard member={worker} key={key} />;
        })}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    height: SCREEN_HEIGHT * 0.92,
  },
});

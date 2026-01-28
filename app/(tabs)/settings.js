import { useState, useCallback } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";

import { useRouter } from "expo-router";
import { useGameSettingsStore } from "../../src/store/useGameSettingsStore";
import { colors } from "../../src/styles/colors";
import { globalStyles } from "../../src/styles/globalStyles";

export default function Settings() {
  const { amount, difficulty, type, saveSettings } = useGameSettingsStore();
  const router = useRouter();

  const [highScore, setHighScore] = useState(0);

  const HS_KEY = "HISTORYQUIZ_highscore";
  function readHighScore() {
    try {
      const raw = globalThis[HS_KEY];
      return typeof raw === "number" ? raw : 0;
    } catch (e) {
      return 0;
    }
  }

  useFocusEffect(
    useCallback(() => {
      setHighScore(readHighScore());
    }, [])
  );

  const [localAmount, setLocalAmount] = useState(String(amount));
  const [localDifficulty, setLocalDifficulty] = useState(difficulty);
  const [localType, setLocalType] = useState(type);

  function onSave() {
    const parsed = Math.max(1, Math.min(20, Number(localAmount) || 10));
    saveSettings({ amount: parsed, difficulty: localDifficulty, type: localType });
    Alert.alert("Settings saved", "Your settings were saved successfully.", [{ text: "OK" }]);
    router.replace("/");
  }

  function resetHighScore() {
    try {
      globalThis[HS_KEY] = 0;
      setHighScore(0);
      Alert.alert("High score reset");
    } catch (e) {
      Alert.alert("Error", "Could not reset high score");
    }
  }

  return (
    <SafeAreaView style={globalStyles.screen}>
      <View style={{ marginBottom: 8 }}>
        <Text style={globalStyles.title}>Settings</Text>
        <Text style={globalStyles.subtitle}>Customize your quiz</Text>
      </View>

      <Text style={globalStyles.muted}>Amount (1-20)</Text>
      <TextInput
        value={localAmount}
        onChangeText={setLocalAmount}
        keyboardType="numeric"
        style={globalStyles.input}
      />

      <Text style={globalStyles.muted}>Difficulty</Text>
      <View style={[globalStyles.pickerWrap, { marginTop: 8, marginBottom: 16 }]}>
        <Picker
          selectedValue={localDifficulty}
          onValueChange={setLocalDifficulty}
          style={{ color: colors.text }}
          itemStyle={{ color: colors.text }}
        >
          <Picker.Item label="Easy" value="easy" color={colors.text} />
          <Picker.Item label="Medium" value="medium" color={colors.text} />
          <Picker.Item label="Hard" value="hard" color={colors.text} />
        </Picker>
      </View>

      <Text style={globalStyles.muted}>Type</Text>
      <View style={[globalStyles.pickerWrap, { marginTop: 8, marginBottom: 16 }]}>
        <Picker
          selectedValue={localType}
          onValueChange={setLocalType}
          style={{ color: colors.text }}
          itemStyle={{ color: colors.text }}
        >
          <Picker.Item label="Multiple Choice" value="multiple" color={colors.text} />
          <Picker.Item label="True / False" value="boolean" color={colors.text} />
        </Picker>
      </View>

      <TouchableOpacity onPress={onSave} style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Save</Text>
      </TouchableOpacity>

      <View style={globalStyles.currentCard}>
        <Text style={globalStyles.subtitle}>Current store</Text>
        <View style={globalStyles.currentRow}>
          <Text style={globalStyles.currentKey}>Amount</Text>
          <Text style={globalStyles.currentValue}>{amount}</Text>
        </View>
        <View style={globalStyles.currentRow}>
          <Text style={globalStyles.currentKey}>Difficulty</Text>
          <Text style={globalStyles.currentValue}>{difficulty}</Text>
        </View>
        <View style={globalStyles.currentRow}>
          <Text style={globalStyles.currentKey}>Type</Text>
          <Text style={globalStyles.currentValue}>{type}</Text>
        </View>
        <View style={globalStyles.currentRow}>
          <Text style={globalStyles.currentKey}>High score</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={globalStyles.currentValue}>{highScore}</Text>
            <TouchableOpacity onPress={resetHighScore} style={{ paddingHorizontal: 10 }}>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

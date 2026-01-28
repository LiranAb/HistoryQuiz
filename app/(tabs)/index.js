import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View, Animated, Easing, Alert, SafeAreaView } from "react-native";

import { useGameSettingsStore } from "../../src/store/useGameSettingsStore";
import { fetchQuizQuestions } from "../../src/services/apiService";
import { globalStyles } from "../../src/styles/globalStyles";


import LottieView from "lottie-react-native";

export default function Home() {
  const { amount, difficulty, type } = useGameSettingsStore();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const passThreshold = useMemo(
    () => Math.ceil((questions.length || amount) / 2),
    [questions.length, amount]
  );
  const pass = useMemo(() => correctCount >= passThreshold, [correctCount, passThreshold]);

  async function loadGame() {
    setLoading(true);
    setFinished(false);
    setIndex(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setShowFeedback(false);

    try {
      let data = await fetchQuizQuestions({ amount, difficulty, type });

      if ((!data || data.length === 0) && difficulty) {
        const fallbackOrder = difficulty === "hard" ? ["medium", "easy"] : ["easy"];
        let used = null;
        for (const d of fallbackOrder) {
          const alt = await fetchQuizQuestions({ amount, difficulty: d, type });
          if (alt && alt.length > 0) {
            data = alt;
            used = d;
            break;
          }
        }

        if (used) {
          Alert.alert(
            "No questions for selected difficulty",
            `Couldn't find questions for "${difficulty}". Loaded ${data.length} questions with "${used}" difficulty instead.`
          );
        } else if (!data || data.length === 0) {
          const alt = await fetchQuizQuestions({ amount, type });
          if (alt && alt.length > 0) {
            data = alt;
            Alert.alert(
              "No questions for selected difficulty",
              `Couldn't find questions for "${difficulty}". Loaded ${data.length} questions without difficulty filter.`
            );
          } else {
            Alert.alert(
              "No questions available",
              "No questions could be loaded for the selected settings. Try changing amount/type/difficulty in Settings."
            );
            data = [];
          }
        }
      }

      setQuestions(data || []);
    } catch (e) {
      setQuestions([]);
      Alert.alert("Error", "Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGame();
  }, [amount, difficulty, type]);

  const HS_KEY = "HISTORYQUIZ_highscore";
  function getStoredHighScore() {
    const v = globalThis[HS_KEY];
    return typeof v === "number" ? v : 0;
  }
  function setStoredHighScore(n) {
    globalThis[HS_KEY] = n;
  }

  const jump = useRef(new Animated.Value(0)).current;
  const jumpAnimRef = useRef(null);

  useEffect(() => {
    if (finished) {
      jumpAnimRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(jump, {
            toValue: -22,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(jump, {
            toValue: 0,
            duration: 400,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ])
      );
      jumpAnimRef.current.start();
    } else {
      if (jumpAnimRef.current) {
        jumpAnimRef.current.stop();
        jumpAnimRef.current = null;
      }
      jump.setValue(0);
    }
    return () => {
      if (jumpAnimRef.current) {
        jumpAnimRef.current.stop();
        jumpAnimRef.current = null;
      }
    };
  }, [finished, jump]);

  useEffect(() => {
    if (!finished) return;
    try {
      const best = getStoredHighScore();
      if (correctCount > best) {
        setStoredHighScore(correctCount);
      }
    } catch (e) {
    }
  }, [finished, correctCount]);

  function onAnswerPress(answer) {
    if (showFeedback) return;
    const q = questions[index];
    const isCorrect = answer === q.correctAnswer;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    if (isCorrect) setCorrectCount((c) => c + 1);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      const next = index + 1;
      if (next >= questions.length) {
        setFinished(true);
      } else {
        setIndex(next);
      }
    }, 800);
  }

  if (loading) {
    return (
      <SafeAreaView style={[globalStyles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <View style={{ width: 160, height: 160 }}>
          <LottieView
            source={require("../../src/assets/lottie/loading.json")}
            autoPlay
            loop
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <Text style={[globalStyles.muted, { textAlign: "center", marginTop: 12 }]}>
          Loading questions...
        </Text>
      </SafeAreaView>
    );
  }

  if (!questions.length) {
    return (
      <SafeAreaView style={[globalStyles.screen, { justifyContent: "center", gap: 12 }]}>
        <Text style={[globalStyles.title, { textAlign: "center" }]}>No questions</Text>
        <Pressable style={globalStyles.button} onPress={loadGame}>
          <Text style={globalStyles.buttonText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <SafeAreaView style={[globalStyles.screen, { justifyContent: "center", gap: 16 }]}>
        <View style={[globalStyles.card, { padding: 16 }]}>
          <Text style={[globalStyles.title, { textAlign: "center" }]}>
            Result: {correctCount} / {questions.length}
          </Text>

          <Text style={[globalStyles.text, { textAlign: "center", marginTop: 6 }]}>
            {pass ? `Passed ✅ (≥ ${passThreshold} correct)` : `Failed ❌ (need ${passThreshold} correct)`}
          </Text>

          <View style={globalStyles.resultContainer}>
            <Animated.Text
              style={[globalStyles.resultEmoji, { transform: [{ translateY: jump }] }]}
              accessible
              accessibilityLabel={pass ? "celebration emoji" : "sad emoji"}
            >
              {pass ? "🎉" : "😢"}
            </Animated.Text>
          </View>

          <View style={{ height: 220, marginTop: 12 }}>
            <LottieView
              source={
                pass
                  ? require("../../src/assets/lottie/success.json")
                  : require("../../src/assets/lottie/fail.json")
              }
              autoPlay
              loop
              resizeMode="contain"
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          <Pressable style={globalStyles.button} onPress={loadGame}>
            <Text style={globalStyles.buttonText}>Restart</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const progress = ((index + 1) / questions.length) * 100;
  const q = questions[index];

  return (
    <SafeAreaView style={globalStyles.screen}>
      <View style={globalStyles.progressContainer}>
        <View style={[globalStyles.progressFill, { width: `${progress}%` }]} />
      </View>

      <Text style={[globalStyles.subtitle, { marginBottom: 10 }]}>
        Question {index + 1} of {questions.length}
      </Text>

      <View style={[globalStyles.card, { padding: 16 }]}>
        <Text style={globalStyles.title}>{q.question}</Text>

        <View style={{ marginTop: 14 }}>
          {q.answers.map((ans) => {
            const isCorrectAns = ans === q.correctAnswer;
            const isSelected = selectedAnswer === ans;
            const disabled = showFeedback;
            const styleArr = [globalStyles.option];
            if (showFeedback) {
              if (isSelected && isCorrectAns) styleArr.push(globalStyles.optionCorrect);
              else if (isSelected && !isCorrectAns) styleArr.push(globalStyles.optionIncorrect);
              else styleArr.push(globalStyles.optionDisabled);
            }
            return (
              <Pressable
                key={ans}
                onPress={() => onAnswerPress(ans)}
                style={styleArr}
                disabled={disabled}
              >
                <Text style={globalStyles.optionText}>{ans}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[globalStyles.muted, { marginTop: 14, textAlign: "center" }]}>
          Score: {correctCount}
        </Text>
      </View>
    </SafeAreaView>
  );
}

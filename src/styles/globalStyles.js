import { StyleSheet, Platform } from "react-native";
import { colors } from "./colors";

export const globalStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 16 },

  title: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: 10 },
  subtitle: { color: colors.muted, fontSize: 14 },
  muted: { color: colors.muted, fontSize: 13 },
  text: { color: colors.text, fontSize: 16 },

  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  input: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: colors.card,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "800" },

  pickerWrap: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  progressContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },

  option: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  optionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  optionCorrect: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  optionIncorrect: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.danger,
  },
  optionDisabled: {
    opacity: 0.65,
  },

  resultContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  resultEmoji: {
    fontSize: 72,
    lineHeight: 80,
  },

  currentCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16,
  },
  currentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  currentKey: {
    color: colors.muted,
    fontSize: 13,
  },
  currentValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});

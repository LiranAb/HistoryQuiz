import axios from "axios";
import { mapQuestions } from "../utils/mapQuestions";

const BASE_URL = "https://opentdb.com/api.php";
const CATEGORY = 23; // History

export async function fetchQuizQuestions({ amount, difficulty, type }) {
  const params = {
    amount,
    category: CATEGORY,
    difficulty,
    type, // multiple | boolean
  };

  const { data } = await axios.get(BASE_URL, { params });

  if (!data || data.response_code !== 0) {
    throw new Error("API error");
  }

  return mapQuestions(data.results);
}

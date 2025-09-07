import { Groq } from "@groq/groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

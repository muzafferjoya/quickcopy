import { NextApiRequest, NextApiResponse } from "next";
import { groq } from "../../../lib/groq";
import { supabase } from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input, template } = req.body;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const promptText = `
      ${template.prompt.replace("{{input}}", input)}
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: promptText }],
      temperature: 0.7,
      max_tokens: 150,
    });

    const output = response.choices[0].message.content || "";

    const { data, error } = await supabase.from("copies").insert({
      user_id: userId,
      input,
      output,
    }).select();

    if (error) throw error;

    return res.status(200).json({ output });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to generate copy" });
  }
}

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { groq } from "../lib/groq";
import { templates } from "../lib/templates";

export default function Form({ onGenerate }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState("linkedin");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      const promptText = templates[template].prompt.replace("{{input}}", input);

      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: promptText }],
        temperature: 0.7,
        max_tokens: 150,
      });

      const generated = response.choices[0].message.content || "";

      // Save to Supabase
      const { data, error } = await supabase.from("copies").insert({
        user_id: userId,
        input,
        output: generated,
      }).select();

      if (error) throw error;

      setOutput(generated);
      onGenerate(generated);
    } catch (err) {
      alert("Error generating copy: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">What should I write about?</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., launching my SaaS product"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Choose format</label>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          {Object.entries(templates).map(([key, tmpl]) => (
            <option key={key} value={key}>{tmpl.title}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? "Generating..." : "Generate Copy"}
      </button>

      {output && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border mt-4">
          <p className="text-gray-800 dark:text-gray-200">{output}</p>
        </div>
      )}
    </form>
  );
}

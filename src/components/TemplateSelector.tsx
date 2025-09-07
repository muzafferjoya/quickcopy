import { useState } from "react";
import { templates } from "../lib/templates";

export default function TemplateSelector({ onGenerate }) {
  const [selected, setSelected] = useState("linkedin");

  const handleGenerate = () => {
    const template = templates[selected];
    onGenerate(template.prompt);
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border">
      <h3 className="font-semibold mb-3">Choose a format</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(templates).map(([key, tmpl]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className={`p-3 text-left rounded border transition ${
              selected === key
                ? "border-blue-500 bg-blue-100 dark:bg-blue-800"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <strong className="block">{tmpl.title}</strong>
            <small className="text-gray-500 dark:text-gray-400">
              {tmpl.prompt.substring(0, 50)}...
            </small>
          </button>
        ))}
      </div>
      <button
        onClick={handleGenerate}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
      >
        Generate with {templates[selected].title}
      </button>
    </div>
  );
}

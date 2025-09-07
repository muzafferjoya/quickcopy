import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function CopyCard({ copy, onFavorite }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) return;

    try {
      const { count } = await supabase
        .from("favorites")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .eq("copy_id", copy.id);

      if (count === 0) {
        await supabase.from("favorites").insert({
          user_id: userId,
          copy_id: copy.id
        });
        setIsFavorited(true);
      } else {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("copy_id", copy.id);
        setIsFavorited(false);
      }

      if (onFavorite) onFavorite();
    } catch (err) {
      alert("Error saving favorite");
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 mb-4">
      <p className="text-gray-800 dark:text-gray-200">{copy.output}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(copy.created_at).toLocaleDateString()}
        </span>
        <button
          onClick={handleFavorite}
          className={`text-sm px-3 py-1 rounded ${
            isFavorited
              ? "bg-red-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          {isFavorited ? "❤️ Faved" : "♡ Save"}
        </button>
      </div>
    </div>
  );
}

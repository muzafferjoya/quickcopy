import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import CopyCard from "./CopyCard";
import TemplateSelector from "./TemplateSelector";
import ThemeToggle from "./ThemeToggle";

export default function Dashboard() {
  const [copies, setCopies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchCopies = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      const { data } = await supabase
        .from("copies")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setCopies(data || []);
    };

    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      const { data } = await supabase
        .from("favorites")
        .select("copy(*)")
        .eq("user_id", userId);

      setFavorites(data?.map(f => f.copy) || []);
    };

    fetchCopies();
    fetchFavorites();
  }, []);

  const handleGenerate = (prompt) => {
    alert("Would generate with: " + prompt);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <header className="border-b dark:border-gray-700 p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Copies</h1>
        <div className="flex space-x-4">
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <TemplateSelector onGenerate={handleGenerate} />

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Recent Copies</h2>
          {copies.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No copies yet.</p>
          ) : (
            copies.map((copy) => (
              <CopyCard key={copy.id} copy={copy} onFavorite={() => {}} />
            ))
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Favorites</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No favorites yet.</p>
          ) : (
            favorites.map((copy) => (
              <CopyCard key={copy.id} copy={copy} onFavorite={() => {}} />
            ))
          )}
        </section>
      </main>
    </div>
  );
}

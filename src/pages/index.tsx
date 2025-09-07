import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">QuickCopy.ai</h1>
          <p className="text-lg text-gray-600 mb-8">
            Write better copy in 1 second — save your best ideas, share them, grow your brand.
          </p>
        </header>

        {!isLoggedIn ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600">Sign in to start writing.</p>
            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: "email" })}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Sign In with Email
            </button>
          </div>
        ) : (
          window.location.href = "/dashboard"
        )}
      </div>
    </div>
  );
}

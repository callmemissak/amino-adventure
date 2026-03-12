"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setEmail("");
        setPassword("");
        alert("Signup successful! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (session) {
    return (
      <div
        style={{
          padding: "16px",
          marginBottom: "16px",
          background: "#1a1a2e",
          borderRadius: "8px",
          border: "1px solid #34d399",
        }}
      >
        <p style={{ margin: "0 0 12px 0", color: "#e2ddd5" }}>
          Logged in as: <strong>{session.user.email}</strong>
        </p>
        <button
          onClick={handleSignOut}
          style={{
            padding: "8px 16px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "16px",
        background: "#1a1a2e",
        borderRadius: "8px",
        border: "1px solid #34d399",
      }}
    >
      <h2 style={{ margin: "0 0 16px 0", color: "#e2ddd5" }}>
        {isSignUp ? "Create Account" : "Login"}
      </h2>

      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            background: "#0a0a10",
            border: "1px solid #34d399",
            color: "#e2ddd5",
            borderRadius: "4px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            background: "#0a0a10",
            border: "1px solid #34d399",
            color: "#e2ddd5",
            borderRadius: "4px",
            boxSizing: "border-box",
          }}
        />

        {error && (
          <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#34d399",
            color: "#08080f",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: "12px",
          color: "#e2ddd5",
          fontSize: "14px",
        }}
      >
        {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            background: "none",
            border: "none",
            color: "#34d399",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "14px",
          }}
        >
          {isSignUp ? "Log In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}

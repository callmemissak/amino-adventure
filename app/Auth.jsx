"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function Auth() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription?.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="pb-link-list">
        <div className="pb-eyebrow">Supabase setup required</div>
        <h2 className="pb-card-title">Authentication is scaffolded and ready</h2>
        <p className="pb-body">
          Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the service role key to enable account flows, saved data, and email capture.
        </p>
        <div className="pb-fact-row">Environment variables can be copied from `.env.example`, then connected to the Supabase tables included with this refactor.</div>
      </div>
    );
  }

  const handleAuth = async (event) => {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError("");

    const operation = isSignUp
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password });

    const { error: authError } = await operation;
    if (authError) {
      setError(authError.message);
    } else if (isSignUp) {
      setEmail("");
      setPassword("");
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  };

  if (session) {
    return (
      <div className="pb-link-list">
        <div className="pb-eyebrow">Authenticated</div>
        <h2 className="pb-card-title">Welcome back</h2>
        <div className="pb-fact-row"><strong>Email:</strong> {session.user.email}</div>
        <button className="pb-button-secondary" onClick={handleSignOut}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-eyebrow">{isSignUp ? "Create account" : "Log in"}</div>
      <h2 className="pb-card-title">{isSignUp ? "Start your PeptaBase workspace" : "Access your dashboard"}</h2>
      <p className="pb-form-help">
        Authentication is powered by Supabase and is ready for future subscription-gated dashboard features.
      </p>
      <form onSubmit={handleAuth} className="pb-link-list">
        <input className="pb-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="pb-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <div className="pb-warning-box">{error}</div> : null}
        <button className="pb-button" type="submit" disabled={loading}>
          {loading ? "Working..." : isSignUp ? "Create account" : "Log in"}
        </button>
      </form>
      <button className="pb-button-secondary" style={{ marginTop: 12 }} onClick={() => setIsSignUp((value) => !value)}>
        {isSignUp ? "Use existing account" : "Create a new account"}
      </button>
    </div>
  );
}

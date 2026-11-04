// components/auth.tsx
// One-click Google sign-in + avatar for the header.
// Uses Supabase Auth. When signed in, progress syncs to cloud via lib/db.ts
// (SupabaseDB). When signed out, everything stays local.

"use client";

import { useEffect, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";
import { migrateLocalToCloud } from "../lib/db";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export function useAuthUser(): {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  configured: boolean;
} {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const client = getClient();

  useEffect(() => {
    if (!client) {
      setLoading(false);
      return;
    }
    client.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      // First sign-in on this device: push local progress to the cloud.
      if (nextUser && !user) {
        migrateLocalToCloud().catch(() => {});
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async () => {
    if (!client) return;
    await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/`
            : undefined,
      },
    });
  };

  const signOut = async () => {
    if (!client) return;
    await client.auth.signOut();
    setUser(null);
  };

  return { user, loading, signIn, signOut, configured: !!client };
}

/** Single round avatar button for the header. Tapping signs in with Google. */
export function AuthAvatar() {
  const { user, loading, signIn, signOut, configured } = useAuthUser();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!configured || loading) return null;

  if (!user) {
    return (
      <button
        type="button"
        onClick={signIn}
        aria-label="Sign in with Google"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text-faint)] transition-transform active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    );
  }

  const photo =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined);
  const initial = (user.email?.[0] ?? "U").toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Account"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--neon)]/40 bg-[var(--neon)]/10 transition-transform active:scale-95"
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-[14px] font-bold text-[var(--neon-soft)]">
            {initial}
          </span>
        )}
      </button>
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg)] p-3 shadow-[var(--shadow)]">
            <p className="truncate text-[13px] font-semibold text-[var(--text)]">
              {user.user_metadata?.full_name ?? user.email}
            </p>
            <p className="truncate text-[11px] text-[var(--text-faint)]">
              {user.email}
            </p>
            <p className="mt-1 text-[11px] text-[var(--neon-soft)]">
              Progress syncs across devices
            </p>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="mt-2 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-[13px] font-semibold text-[var(--text)] active:opacity-80"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const PROMPT_DISMISSED_KEY = "macstudy:signin-prompt-dismissed";

/**
 * Gentle auto sign-in nudge. Appears once per device after 4 seconds when
 * the visitor is not signed in and has not dismissed it before.
 * Reads the dismissal flag from localStorage (the "cookie" the user asked
 * about) so it never nags twice.
 */
export function AutoSignInPrompt() {
  const { user, loading, signIn, configured } = useAuthUser();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!configured || loading || user) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(PROMPT_DISMISSED_KEY) === "1") return;
    const t = window.setTimeout(() => setVisible(true), 4000);
    return () => window.clearTimeout(t);
  }, [configured, loading, user]);

  if (!visible || !configured || loading || user) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(PROMPT_DISMISSED_KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-[420px]">
      <div className="glass-strong flex items-center gap-3 rounded-3xl p-4 shadow-[var(--shadow)]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[var(--neon-soft)]">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <path
              d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-bold text-[var(--text)]">
            Sync your progress
          </span>
          <span className="block text-[12px] text-[var(--text-faint)]">
            Sign in to keep XP and streaks on every device
          </span>
        </span>
        <button
          type="button"
          onClick={() => {
            dismiss();
            signIn();
          }}
          className="shrink-0 rounded-full bg-[var(--neon)] px-4 py-2 text-[13px] font-bold text-black active:opacity-80"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1 text-[var(--text-faint)]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Global error boundary: catches any render or click-handler error and
 * shows a friendly reload card instead of a white screen crash.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // Swallow the error; a reload fixes most transient crashes.
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-4xl font-bold text-[var(--neon)]">!</p>
          <h1 className="text-lg font-bold text-[var(--text)]">
            Something went wrong
          </h1>
          <p className="text-sm text-[var(--text-dim)]">
            Tap reload to get back to your studies.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-[var(--neon)] px-6 py-3 text-sm font-bold text-black active:opacity-80"
          >
            Reload
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

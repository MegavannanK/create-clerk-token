"use client";

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth
} from "@clerk/clerk-react";
import TokenGenerator from "./components/TokenGenerator";

export default function Home() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--color-bg)' }}>
        <div className="pulse-dot" style={{ width: '24px', height: '24px' }}></div>
      </div>
    );
  }

  return (
    <>
      <div className="gradient-bg" />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          minHeight: "100vh",
        }}
      >
        {!userId ? (
          /* Signed Out View */
          <div
            className="glass-card"
            style={{
              padding: "3rem 2.5rem",
              textAlign: "center",
              maxWidth: "440px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, var(--color-primary), #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                margin: "0 0 0.5rem",
                background:
                  "linear-gradient(135deg, var(--color-text), var(--color-text-muted))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Clerk Token Generator
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-text-muted)",
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              Sign in to generate JWT session tokens
              <br />
              for backend API testing.
            </p>

            <SignUpButton mode="modal">
              <button id="sign-up-btn" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", marginBottom: "0.75rem" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Create Account
              </button>
            </SignUpButton>

            <SignInButton mode="modal">
              <button id="sign-in-btn" className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In
              </button>
            </SignInButton>
          </div>
        ) : (
          /* Signed In View */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
              width: "100%",
              maxWidth: "620px",
            }}
          >
            {/* Top bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <h1
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  margin: 0,
                  background:
                    "linear-gradient(135deg, var(--color-text), var(--color-text-muted))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                🔑 Token Generator
              </h1>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: {
                      width: "32px",
                      height: "32px",
                    },
                  },
                }}
              />
            </div>

            {/* Token generator card */}
            <TokenGenerator />
          </div>
        )}
      </main>
    </>
  );
}

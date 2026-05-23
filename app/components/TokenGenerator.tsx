"use client";

import { useAuth, useUser } from "@clerk/clerk-react";
import { useState, useCallback } from "react";

const TOKEN_TEMPLATE =
  process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME ?? "ten-minute-token";

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function RefreshIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={spinning ? "animate-spin" : ""}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function formatTimestamp(ts: unknown): string {
  if (typeof ts !== "number") return String(ts);
  const date = new Date(ts * 1000);
  return date.toLocaleString();
}

function JsonHighlight({ data }: { data: Record<string, unknown> }) {
  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null) return <span className="json-null">null</span>;
    if (typeof value === "boolean")
      return <span className="json-boolean">{String(value)}</span>;
    if (typeof value === "number")
      return <span className="json-number">{value}</span>;
    if (typeof value === "string")
      return <span className="json-string">&quot;{value}&quot;</span>;
    return <span className="json-string">{JSON.stringify(value)}</span>;
  };

  const entries = Object.entries(data);
  return (
    <div>
      {"{"}
      {entries.map(([key, value], i) => (
        <div key={key} style={{ paddingLeft: "1rem" }}>
          <span className="json-key">&quot;{key}&quot;</span>
          <span style={{ color: "#71717a" }}>: </span>
          {renderValue(value)}
          {i < entries.length - 1 ? "," : ""}
          {(key === "iat" || key === "exp" || key === "nbf") &&
            typeof value === "number" && (
              <span style={{ color: "#52525b", marginLeft: "0.5rem" }}>
                {"// "}
                {formatTimestamp(value)}
              </span>
            )}
        </div>
      ))}
      {"}"}
    </div>
  );
}

export default function TokenGenerator() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDecoded, setShowDecoded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const t = await getToken({
        template: TOKEN_TEMPLATE,
        skipCache: true,
      });
      if (t) {
        setToken(t);
        setShowDecoded(false);
      } else {
        setError("Failed to generate token. Please try signing in again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const copyToken = useCallback(async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API may not be available */
    }
  }, [token]);

  if (!isSignedIn) return null;

  const decoded = token ? decodeJwtPayload(token) : null;

  return (
    <div className="glass-card" style={{ padding: "2rem", width: "100%", maxWidth: "620px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, var(--color-primary), #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <KeyIcon />
          </div>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
              Session Token
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-dim)", margin: 0, lineHeight: 1.3 }}>
              JWT for backend API testing
            </p>
          </div>
        </div>
        {user && (
          <span className="badge badge-success">
            <span className="pulse-dot" />
            {user.primaryEmailAddress?.emailAddress?.split("@")[0] ?? "Signed in"}
          </span>
        )}
      </div>

      {/* Action row */}
      <div style={{ display: "flex", gap: "0.625rem", marginBottom: "1.25rem" }}>
        <button
          id="generate-token-btn"
          className="btn-primary"
          onClick={generateToken}
          disabled={loading}
        >
          <RefreshIcon spinning={loading} />
          {token ? "Regenerate" : "Generate Token"}
        </button>
        {token && (
          <button
            id="copy-token-btn"
            className="btn-secondary"
            onClick={copyToken}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? (
              <span className="copy-feedback" style={{ color: "var(--color-success)" }}>
                Copied!
              </span>
            ) : (
              "Copy"
            )}
          </button>
        )}
        {token && (
          <button
            id="decode-token-btn"
            className="btn-secondary"
            onClick={() => setShowDecoded(!showDecoded)}
          >
            <EyeIcon />
            {showDecoded ? "Hide" : "Decode"}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: "10px",
          padding: "0.75rem 1rem",
          marginBottom: "1rem",
          fontSize: "0.8rem",
          color: "var(--color-danger)"
        }}>
          {error}
        </div>
      )}

      {/* Token display */}
      {token ? (
        <div className="token-display" id="token-output">
          {token}
        </div>
      ) : (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100px",
          border: "1px dashed var(--color-border)",
          borderRadius: "12px",
          color: "var(--color-text-dim)",
          fontSize: "0.8rem"
        }}>
          Click &quot;Generate Token&quot; to create a 10-minute JWT
        </div>
      )}

      {/* Decoded JWT */}
      {showDecoded && decoded && (
        <div className="decode-section">
          <div className="decode-label">Decoded Payload</div>
          <div className="decode-content">
            <JsonHighlight data={decoded} />
          </div>
        </div>
      )}

      {/* Hint */}
      {token && (
        <p style={{
          marginTop: "1rem",
          fontSize: "0.7rem",
          color: "var(--color-text-dim)",
          lineHeight: 1.5
        }}>
          Use this token as{" "}
          <code style={{
            background: "var(--color-surface)",
            padding: "0.125rem 0.375rem",
            borderRadius: "4px",
            fontSize: "0.65rem",
            border: "1px solid var(--color-border)"
          }}>
            Authorization: Bearer &lt;token&gt;
          </code>{" "}
          in your API requests. Tokens use the Clerk JWT template{" "}
          <code style={{
            background: "var(--color-surface)",
            padding: "0.125rem 0.375rem",
            borderRadius: "4px",
            fontSize: "0.65rem",
            border: "1px solid var(--color-border)"
          }}>
            {TOKEN_TEMPLATE}
          </code>{" "}
          and should expire after 10 minutes.
        </p>
      )}
    </div>
  );
}

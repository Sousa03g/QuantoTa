/**
 * @file app/page.tsx
 * @description Landing page for the QuantoTa? API.
 */

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⚽ QuantoTa?</h1>
      <p style={{ color: "#666" }}>API v1.0.0</p>
      <p style={{ marginTop: "1rem", color: "#999", fontSize: "0.875rem" }}>
        Live football scores &amp; stats
      </p>
    </main>
  );
}

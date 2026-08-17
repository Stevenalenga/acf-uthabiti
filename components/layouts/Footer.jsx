export default function Footer() {
  return (
    <footer
      style={{
        background: "#111",
        color: "#ddd",
        padding: "2.5rem 1.5rem",
        marginTop: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0, color: "#aaa", fontSize: "0.95rem" }}>
          Africa Childcare Forum — convened within the Uthabiti Care Economy ecosystem.
        </p>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          <a
            href="https://uthabitiafrica.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#E5553C", textDecoration: "none", fontWeight: 600 }}
          >
            Uthabiti Africa
          </a>
          <a
            href="https://uthabitiafrica.org/platforms"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#E5553C", textDecoration: "none", fontWeight: 600 }}
          >
            Platforms
          </a>
          <a
            href="https://cac.uthabitiafrica.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#E5553C", textDecoration: "none", fontWeight: 600 }}
          >
            CAC
          </a>
          <a
            href="https://mamaplus.co.ke/join-network"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#E5553C", textDecoration: "none", fontWeight: 600 }}
          >
            Join Network
          </a>
        </div>
      </div>
    </footer>
  );
}

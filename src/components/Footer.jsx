import React from "react";

// --- COMPONENTE FOOTER ---
export default function Footer() {
  return (
    <footer className="footer_pai">
      <div className="footer_linha1">
        <img src="/src/assets/svg/logo_white.svg" alt="logo" style={{ height: "45px" }} />
        <div className="footer_linha1_social">
          <img src="/src/assets/svg/icon_facebook.svg" alt="icon-social" />
          <img src="/src/assets/svg/icon_instagram3.svg" alt="icon-social" />
          <img src="/src/assets/svg/icon_linkedin.svg" alt="icon-social" />
        </div>
      </div>
      <div className="footer_linha2"></div>
      <p className="paragrafo-2" style={{ color: "var(--rosa-4)" }}>
        @Copyright2025 Todos os direitos reservados.
      </p>
    </footer>
  );
}

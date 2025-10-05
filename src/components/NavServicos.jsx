import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavServicos() {
  const navigate = useNavigate();
  const location = useLocation();

  // Função para definir a classe dinamicamente
  const getClass = (path) => {
    return location.pathname === path
      ? "paragrafo-2 mini_nav_filho_ativo"
      : "paragrafo-2 mini_nav_filho";
  };

  return (
    <div className="mini_nav_pai">
      <p
        className={getClass("/adm/servicos-servicos")}
        onClick={() => navigate("/adm/servicos-servicos")}
      >
        Serviços
      </p>
      <p
        className={getClass("/adm/servicos-cupos")}
        onClick={() => navigate("/adm/servicos-cupos")}
      >
        Cupons
      </p>
    </div>
  );
}

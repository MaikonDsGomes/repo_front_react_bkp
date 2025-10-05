import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavCalendario() {
  const navigate = useNavigate();
  const location = useLocation();

  // função para definir a classe dinamicamente
  const getClass = (path) => {
    return location.pathname === path
      ? "paragrafo-2 mini_nav_filho_ativo"
      : "paragrafo-2 mini_nav_filho";
  };

  return (
    <div className="mini_nav_pai">
      <p
        className={getClass("/adm/calendario-visao-geral")}
        onClick={() => navigate("/adm/calendario-visao-geral")}
      >
        Visão Geral
      </p>
      <p
        className={getClass("/adm/calendario-atendimentos")}
        onClick={() => navigate("/adm/calendario-atendimentos")}
      >
        Atendimentos Passados
      </p>
      <p
        className={getClass("/adm/calendario-configuracoes")}
        onClick={() => navigate("/adm/calendario-configuracoes")}
      >
        Configurações
      </p>
    </div>
  );
}

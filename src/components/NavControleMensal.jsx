import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavControleMensal() {
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
        className={getClass("/adm/controle-servicos")}
        onClick={() => navigate("/adm/controle-servicos")}
      >
        Serviços
      </p>
      <p
        className={getClass("/adm/controle-cancelamentos")}
        onClick={() => navigate("/adm/controle-cancelamentos")}
      >
        Cancelamentos
      </p>
      <p
        className={getClass("/adm/controle-avaliacoes")}
        onClick={() => navigate("/adm/controle-avaliacoes")}
      >
        Avaliações
      </p>
    </div>
  );
}

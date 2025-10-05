import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavUsuarios() {
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
        className={getClass("/adm/usuarios-clientes")}
        onClick={() => navigate("/adm/usuarios-clientes")}
      >
        Cliente
      </p>
      <p
        className={getClass("/adm/usuarios-funcionarios")}
        onClick={() => navigate("/adm/usuarios-funcionarios")}
      >
        Funcionários
      </p>
    </div>
  );
}

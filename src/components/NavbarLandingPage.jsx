import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NavSemLogin() {

  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("usuarioLogado") === "1");
  }, []);

  const isHome = location.pathname === "/";
  const isServicos = location.pathname === "/servicos";

  return (
    <nav className="nav_institucional_pai">
      <div className="nav_institucional_coluna">
        <p
          className={`paragrafo-2 ${isHome ? "underline" : "underline-hover"}`}
          onClick={() => navigate("/")}
        >
          Página Inicial
        </p>
        <p
          className={`paragrafo-2 ${isServicos ? "underline" : "underline-hover"}`}
          onClick={() => navigate("/servicos")}
        >
          Serviços
        </p>
      </div>
      <div className="nav_institucional_coluna">
        <img src="src/assets/svg/logo_black.svg" alt="logo" style={{ height: "50px" }} />
      </div>
      <div className="nav_institucional_coluna">

        {!isLoggedIn && (
          <>
            <button id="btn_entrar" className="btn-branco" onClick={() => navigate("/login")}>Entrar</button>
            <button id="btn_cadastrar" className="btn-rosa" onClick={() => navigate("/cadastro")}>Cadastre-se</button>
          </>
        )}
        {isLoggedIn && (

          <button
            id="btn_perfil"
            className="btn-rosa"
            onClick={() => {
              if (
                usuario?.tipoUsuario?.descricao === "ADMINISTRADOR" ||
                usuario?.tipoUsuario?.descricao === "FUNCIONARIO"
              ) {
                navigate("/adm/calendario-visao-geral");
              } else {
                navigate("/config-perfil");
              }
            }}
          >
            Configurações
          </button>


        )}
      </div>
    </nav>
  );
}

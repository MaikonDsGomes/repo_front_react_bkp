import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../js/api/usuario";

export default function MenuDash({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // lógica de logout aqui
    console.log("Logout");
  };

  // Função para determinar se a rota está ativa
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="dash_section_pai">
        <div className="dash_navbar_pai">
          <div className="dash_navbar_filho">
            <img
              src="/src/assets/svg/logo_black.svg"
              alt="icone"
              style={{ maxWidth: "169px" }}
            />
            <p className="paragrafo-e bold">Bem vinda Marina!</p>
            <div className="dash_navbar_column">
              <button
                className={isActive("/adm/calendario-visao-geral") ? "btn-navbar-ativo" : "btn-navbar"}
                onClick={() => navigate("/adm/calendario-visao-geral")}
              >
                <img
                  style={{ maxWidth: "24px" }}
                  src="/src/assets/svg/nav_dash/icon_house_filled.svg"
                  alt=""
                />
                Calendário
              </button>
              <button
                className={isActive("/adm/servicos-servicos") ? "btn-navbar-ativo" : "btn-navbar"}
                onClick={() => navigate("/adm/servicos-servicos")}
              >
                <img
                  style={{ maxWidth: "24px" }}
                  src="/src/assets/svg/nav_dash/icon_tesoura_outline.svg"
                  alt=""
                />
                Serviços
              </button>
              <button
                className={isActive("/adm/usuarios-clientes") ? "btn-navbar-ativo" : "btn-navbar"}
                onClick={() => navigate("/adm/usuarios-clientes")}
              >
                <img
                  style={{ maxWidth: "24px" }}
                  src="/src/assets/svg/nav_dash/icon_user_outline.svg"
                  alt=""
                />
                Usuários
              </button>
              <button
                className={isActive("/adm/controle-servicos") ? "btn-navbar-ativo" : "btn-navbar"}
                onClick={() => navigate("/adm/controle-servicos")}
              >
                <img
                  style={{ maxWidth: "24px" }}
                  src="/src/assets/svg/nav_dash/icon_doc_outline.svg"
                  alt=""
                />
                Controle Mensal
              </button>
              <button
                className={isActive("/adm/perfil") ? "btn-navbar-ativo" : "btn-navbar"}
                onClick={() => navigate("/adm/perfil")}
              >
                <img
                  style={{ maxWidth: "24px" }}
                  src="/src/assets/svg/nav_dash/icon_smile_outline.svg"
                  alt=""
                />
                Perfil
              </button>
            </div>
            <button onClick={() => logout(navigate)} className="btn-sair">
              <img
                style={{ maxWidth: "24px" }}
                src="/src/assets/svg/nav_config/icon_exit.svg"
                alt=""
              />
              Sair
            </button>
          </div>
        </div>
        <div className="dash_section_filho">
        {children}
        </div>

      </div>
    </>
  );
}

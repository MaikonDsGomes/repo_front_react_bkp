import React, { useEffect, useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { logout } from "../js/api/usuario";

export default function MenuDash({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // lógica de logout aqui
    console.log("Logout");
  };

  const [usuario, setUsuario] = useState(null);
    useEffect(() => {
      const usuarioStorage = localStorage.getItem("usuario");
      if (usuarioStorage) {
        const user = JSON.parse(usuarioStorage);
        setUsuario(user);
      }
    }, []);

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
            {/* show first name (or fallback) */}
            <p className="paragrafo-e bold">Bem vinda(o) {usuario?.nome ? usuario.nome.split(' ')[0] : ''}!</p>
            <div className="dash_navbar_column">
              <button
                className={
                  isActive("/adm/calendario-visao-geral") ||
                    isActive("/adm/calendario-atendimentos") ||
                    isActive("/adm/calendario-configuracoes")
                    ? "btn-navbar-ativo"
                    : "btn-navbar"}
                onClick={() => navigate("/adm/calendario-visao-geral")}
              >
                <img
                  style={{ maxWidth: "24px" }}
                  src={
                    (isActive("/adm/calendario-visao-geral") ||
                      isActive("/adm/calendario-atendimentos") ||
                      isActive("/adm/calendario-configuracoes"))
                      ? "/src/assets/svg/nav_dash/icon_house_filled.svg"
                      : "/src/assets/svg/nav_dash/icon_house_outline.svg"
                  }
                  alt=""
                />
                Calendário
              </button>
              <button
                className={
                  isActive("/adm/servicos-servicos") ||
                  isActive("/adm/servicos-cupos")
                  ? "btn-navbar-ativo" 
                  : "btn-navbar"}
                onClick={() => navigate("/adm/servicos-servicos")}
              >
                <img
                  style={{ maxWidth: "24px" }}
                  src={
                    (isActive("/adm/servicos-servicos") ||
                      isActive("/adm/servicos-cupos"))
                      ? "/src/assets/svg/nav_dash/icon_tesoura_filled.svg"
                      : "/src/assets/svg/nav_dash/icon_tesoura_outline.svg"
                  }
                  alt=""
                />
                Serviços
              </button>
              <button
                className={
                  isActive("/adm/usuarios-clientes") ||
                  isActive("/adm/usuarios-funcionarios")
                  ? "btn-navbar-ativo" : "btn-navbar"}
                onClick={() => navigate("/adm/usuarios-clientes")}
              >
                <img
                  style={{ maxWidth: "24px" }}
                  src={
                    (isActive("/adm/usuarios-clientes") ||
                      isActive("/adm/usuarios-funcionarios"))
                      ? "/src/assets/svg/nav_dash/icon_user_filled.svg"
                      : "/src/assets/svg/nav_dash/icon_user_outline.svg"
                  }
                  alt=""
                />
                Usuários
              </button>
              <button
                className={
                  isActive("/adm/controle-servicos") ||
                  isActive("/adm/controle-cancelamentos") ||
                  isActive("/adm/controle-avaliacoes")
                  ? "btn-navbar-ativo" : "btn-navbar"}
                onClick={() => navigate("/adm/controle-servicos")}
              >
                <img
                  style={{ maxWidth: "24px" }}
                  src={
                    (isActive("/adm/controle-servicos") ||
                      isActive("/adm/controle-cancelamentos") ||
                      isActive("/adm/controle-avaliacoes"))
                      ? "/src/assets/svg/nav_dash/icon_doc_filled.svg"
                      : "/src/assets/svg/nav_dash/icon_doc_outline.svg"
                  }
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
                  src={
                    isActive("/adm/perfil")
                      ? "/src/assets/svg/nav_dash/icon_smile_filled.svg"
                      : "/src/assets/svg/nav_dash/icon_smile_outline.svg"
                  }
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

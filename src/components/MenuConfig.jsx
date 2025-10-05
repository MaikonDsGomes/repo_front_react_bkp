
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer.jsx";
import {logout} from "../js/api/usuario.js"

export default function MenuConfig({ children }) {

    const navigate = useNavigate();
    const location = useLocation();

    // Função para determinar se a rota está ativa
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className="nav_institucional_pai">
                <div className="nav_institucional_coluna">
                    <p
                        className="paragrafo-2 underline-hover"
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        Página Inicial
                    </p>
                    <p
                        className="paragrafo-2 underline-hover"
                        onClick={() => navigate("/servicos")}
                        style={{ cursor: "pointer" }}
                    >
                        Serviços
                    </p>
                </div>
                <div className="nav_institucional_coluna">
                    <img src="src/assets/svg/logo_black.svg" alt="logo" style={{ height: 50 }} />
                </div>
                <div className="nav_institucional_coluna">
                    <button
                        className="btn-rosa"
                        onClick={() => navigate("/servicos")}
                        style={{ minWidth: 110 }}
                    >
                        Voltar
                    </button>
                </div>
            </nav>

            <div className="config_section_pai">
                <div className="config_navbar_pai">
                    <div className="config_navbar_filho">
                        <div className="config_navbar_column">
                            <button
                                className={isActive("/config-perfil") ? "btn-navbar-ativo" : "btn-navbar"}
                                onClick={() => navigate("/config-perfil")}
                            >
                                <img style={{ maxWidth: 24 }} src="src/assets/svg/nav_config/icon_home.svg" alt="" />
                                Perfil
                            </button>
                            <button
                                className={isActive("/config-historico") ? "btn-navbar-ativo" : "btn-navbar"}
                                onClick={() => navigate("/config-historico")}
                            >
                                <img style={{ maxWidth: 24 }} src="src/assets/svg/nav_config/icon_folders.svg" alt="" />
                                Meu Histórico
                            </button>
                            <button
                                className={isActive("/config-cupons") ? "btn-navbar-ativo" : "btn-navbar"}
                                onClick={() => navigate("/config-cupons")}
                            >
                                <img style={{ maxWidth: 24 }} src="src/assets/svg/nav_config/icon_cupom.svg" alt="" />
                                CUPONS
                            </button>
                        </div>
                        <button className="btn-sair" onClick={() => logout(navigate)}>
                            <img style={{ maxWidth: 24 }} src="src/assets/svg/nav_config/icon_exit.svg" alt="" />
                            Sair
                        </button>
                    </div>
                </div>

                <div className="config_section_filho">
                    {children}
                    <div className="config_section_divisor"></div>
                </div>
            </div>

            {/* COMPONENTE FOOTER */}
            <Footer/>
        </>
    );
}





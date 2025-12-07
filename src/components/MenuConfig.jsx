
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer.jsx";
import { logout } from "../js/api/usuario.js"

export default function MenuConfig({ children }) {

    const navigate = useNavigate();
    const location = useLocation();

            const isHome = location.pathname === "/";
            const isServicos = location.pathname === "/servicos";
            const [menuOpen, setMenuOpen] = useState(false);
            const menuRef = useRef(null);
            const btnRef = useRef(null);

            // current logged user (used for conditional navigation)
            const usuario = JSON.parse(localStorage.getItem("usuario"));
            const [isLoggedIn, setIsLoggedIn] = useState(false);
            useEffect(() => {
                setIsLoggedIn(localStorage.getItem("usuarioLogado") === "1");
            }, []);
    
      useEffect(() => {
        function handleOutside(e) {
          if (menuOpen && menuRef.current && !menuRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
            setMenuOpen(false);
          }
        }
        function handleKey(e) {
          if (e.key === 'Escape') setMenuOpen(false);
        }
        function handleResize() {
          if (window.innerWidth >= 1440) setMenuOpen(false);
        }
        document.addEventListener('click', handleOutside);
        window.addEventListener('keydown', handleKey);
        window.addEventListener('resize', handleResize);
        return () => {
          document.removeEventListener('click', handleOutside);
          window.removeEventListener('keydown', handleKey);
          window.removeEventListener('resize', handleResize);
        };
      }, [menuOpen]);

    // Função para determinar se a rota está ativa
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className="nav_institucional_pai">
                <div className="nav_institucional_coluna display_none">
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
                    <img src="src/assets/svg/logo_black.svg" alt="logo" className="logo_navbar"/>
                </div>
                
                <div className="nav_institucional_coluna" >
                    <button className="btn-rosa display_none" onClick={() => navigate("/servicos")}>Voltar</button>
                    <div className="hamburguer_menu">
                        <button
                            ref={btnRef}
                            aria-expanded={menuOpen}
                            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                            className="hamburguer_btn"
                            onClick={() => setMenuOpen(v => !v)}
                        >
                            <img src="src/assets/svg/icon_menu.svg" alt="menu" />
                        </button>
                        {menuOpen && (
                            <div className="hamburguer_dropdown" ref={menuRef} role="menu">
                                <button className="hamburguer_item" onClick={() => { setMenuOpen(false); navigate('/'); }} role="menuitem">Página Inicial</button>
                                <button className="hamburguer_item" onClick={() => { setMenuOpen(false); navigate('/servicos'); }} role="menuitem">Serviços</button>
                                <button className="hamburguer_item" onClick={() => { setMenuOpen(false); navigate('/config-perfil'); }} role="menuitem">Perfil</button>
                                <button className="hamburguer_item" onClick={() => { setMenuOpen(false); navigate('/config-historico'); }} role="menuitem">Meu Histórico</button>
                                <button className="hamburguer_item" onClick={() => { setMenuOpen(false); navigate('/config-cupons'); }} role="menuitem">Cupons</button>
                                <button className="hamburguer_item" onClick={() => { setMenuOpen(false); logout(navigate); }} role="menuitem">Sair</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="config_section_pai">
                <div className="config_navbar_pai display_none">
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
            <Footer />
        </>
    );
}





import React from "react";
import { useState, useEffect, useRef } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

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

  return (
    <nav className="nav_institucional_pai">
      <div className="nav_institucional_coluna">
        <p
          className={`paragrafo-2 ${isHome ? "underline" : "underline-hover"} display_none`}
          onClick={() => navigate("/")}
        >
          Página Inicial
        </p>
        <p
          className={`paragrafo-2 ${isServicos ? "underline" : "underline-hover"} display_none`}
          onClick={() => navigate("/servicos")}
        >
          Serviços
        </p>
      </div>
      <div className="nav_institucional_coluna">
        <img src="src/assets/svg/logo_black.svg" alt="logo" className="logo_navbar" />
      </div>
      <div className="nav_institucional_coluna">

        {!isLoggedIn && (
          <>
            <button id="btn_entrar" className="btn-branco display_none" onClick={() => navigate("/login")}>Entrar</button>
            <button id="btn_cadastrar" className="btn-rosa display_none" onClick={() => navigate("/cadastro")}>Cadastre-se</button>
          </>
        )}
        {isLoggedIn && (

          <button
            id="btn_perfil"
            className="btn-rosa display_none"
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
              {!isLoggedIn && (
                <>
                  <button className="hamburguer_item" onClick={() => { setMenuOpen(false); navigate('/login'); }} role="menuitem">Entrar</button>
                  <button className="hamburguer_item" onClick={() => { setMenuOpen(false); navigate('/cadastro'); }} role="menuitem">Cadastre-se</button>
                </>
              )}
              {isLoggedIn && (
                <button className="hamburguer_item" onClick={() => {
                  setMenuOpen(false);
                  if (
                    usuario?.tipoUsuario?.descricao === "ADMINISTRADOR" ||
                    usuario?.tipoUsuario?.descricao === "FUNCIONARIO"
                  ) {
                    navigate("/adm/calendario-visao-geral");
                  } else {
                    navigate("/config-perfil");
                  }
                }} role="menuitem">Configurações</button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

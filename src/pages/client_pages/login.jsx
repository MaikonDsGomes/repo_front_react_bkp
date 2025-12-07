import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../js/api/usuario";



export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // impede o comportamento padrão do form
    login(email, senha, navigate); // chama a função que você implementou
  };
  return (
    <>
      <div className="login">
        <div className="login__imagem">
          <img src="/src/assets/img/logincadastro.png" className="login__img" alt="" />
        </div>


        <div className="login__form">
          <button href="index.html" className="login__voltar paragrafo-2" onClick={() => navigate("/")}>← Voltar</button>
          <div className="login__title">
            <h1 className="titulo-1">Boas-vindas!</h1>
            <p className="paragrafo-1 semibold">Preencha os campos para entrar.</p>

          </div>
          {/* <form onSubmit={handleSubmit} className="login__formulario "> */}
          <form onSubmit={handleSubmit} className="login__formulario">
            <div className="input_pai">
              <label htmlFor="email">Endereço de e-mail</label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="Digite seu endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input_pai">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                className="input"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-rosa login__btn">
              Entrar
            </button>

            <div className="linha-horizontal"></div>
          </form>


          <div>
            <p className="paragrafo-2">Não tem uma conta?
              <button className="login__cadastro" onClick={() => navigate('/cadastro')}>Cadastre-se</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


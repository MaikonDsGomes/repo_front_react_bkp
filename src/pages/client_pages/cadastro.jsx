import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { cadastrarCliente } from "../../js/api/usuario";


export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmar: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
   cadastrarCliente(form); // Passe os dados do formulário
  };

  return (
    <div className="cadastro">
     {/* <!-- Coluna esquerda --> */}
     <div className="cadastro__imagem">
          <img src="/src/assets/img/logincadastro.png" className="login__img" alt="" />
     </div>

     {/* <!-- Coluna direita (formulário) --> */}
     <div className="cadastro__form">
       <button
          className="cadastro__voltar"
          onClick={() => navigate("/")}
        >
          ← Voltar
        </button>

       <div className="cadastro__title">
         <h1 className="titulo-1">Bem vinda(o)!</h1>
         <p className="paragrafo-1 semibold">Preencha os campos para se cadastrar.</p>
       </div>

    
       <form className="cadastro__formulario" onSubmit={handleSubmit}>
         <div className="input_pai">
           <label htmlFor="nome">Nome completo</label>
           <input
              type="text"
              name="nome"
              className="input"
              placeholder="Digite seu nome"
              value={form.nome}
              onChange={handleChange}
            />
         </div>

         <div className="input_pai">
           <label htmlFor="email">Endereço de e-mail</label>
           <input
              type="email"
              name="email"
              className="input"
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={handleChange}
            />
         </div>

         <div className="input_pai">
           <label htmlFor="telefone">Número de telefone</label>
           <input
              type="tel"
              name="telefone"
              className="input"
              placeholder="Digite seu número de telefone"
              value={form.telefone}
              onChange={handleChange}
            />
         </div>

         <div className="input_pai">
           <label htmlFor="senha">Senha</label>
           <input
              type="password"
              name="senha"
              className="input"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={handleChange}
            />
         </div>

         <div className="input_pai">
           <label htmlFor="confirmar">Confirmar senha</label>
           <input
              type="password"
              name="confirmar"
              className="input"
              placeholder="Digite sua senha novamente"
              value={form.confirmar}
              onChange={handleChange}
            />
         </div>

         <button type="submit" className="btn-rosa cadastro__btn">
            Cadastrar
          </button>
         <div className="linha-horizontal"></div>
       </form>
       <div className="cadastro__login">
         <p className="paragrafo-2">Já possui uma conta?
           <button
              className="cadastro__entrar"
              onClick={() => navigate("/login")}
            >
              Entrar
            </button>
         </p>
       </div>
      
     </div>
   </div>
);
}
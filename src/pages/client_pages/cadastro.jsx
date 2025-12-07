import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarCliente, login } from "../../js/api/usuario";
import { phoneMask, onlyDigits } from "../../js/utils";

// Funções auxiliares locais para caret (mantive aqui, as máscaras ficam em utils)
function caretPosFromDigits(newStr, digitsBeforeCursor) {
  if (digitsBeforeCursor <= 0) return 0;
  let digitsSeen = 0;
  for (let i = 0; i < newStr.length; i++) {
    if (/\d/.test(newStr[i])) digitsSeen++;
    if (digitsSeen === digitsBeforeCursor) return i + 1;
  }
  return newStr.length;
}

function setCaretPosition(el, pos) {
  try {
    el.setSelectionRange(pos, pos);
  } catch (e) {
    // ignora se não suportado
  }
}

export default function Cadastro() {
  const navigate = useNavigate();
  const telefoneRef = useRef(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmar: "",
  });

  const handleChange = (e) => {
    const { name, value, selectionStart } = e.target;

    if (name === "telefone") {
      // quantidade de dígitos antes do cursor no valor atual
      const digitsBeforeCursor = onlyDigits(value.slice(0, selectionStart ?? 0)).length;

      const masked = phoneMask(value);
      setForm((prev) => ({ ...prev, telefone: masked }));

      // Ajusta caret após o render
      setTimeout(() => {
        const newPos = caretPosFromDigits(masked, digitsBeforeCursor);
        if (telefoneRef.current) setCaretPosition(telefoneRef.current, newPos);
      }, 0);

      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // envia telefone sem máscara (apenas dígitos)
    const payload = {
      ...form,
      telefone: onlyDigits(form.telefone),
    };
    await cadastrarCliente(payload, navigate); // Passe os dados do formulário
    // await login(form.email, form.senha, navigate); // Loga o usuário após o cadastro
  };

  return (
    <div className="cadastro">
      {/* <!-- Coluna esquerda --> */}
      <div className="cadastro__imagem">
        <img src="/src/assets/img/logincadastro.png" className="login__img" alt="" />
      </div>

      {/* <!-- Coluna direita (formulário) --> */}
      <div className="cadastro__form">
        <button className="cadastro__voltar" onClick={() => navigate("/")}>
          ← Voltar
        </button>

        <div className="cadastro__title">
          <h1 className="titulo-1">Vamos começar!</h1>
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
              ref={telefoneRef}
              type="tel"
              name="telefone"
              className="input"
              placeholder="(XX) XXXXX-XXXX"
              value={form.telefone}
              onChange={handleChange}
              inputMode="numeric"
              autoComplete="tel"
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
          <p className="paragrafo-2">
            Já possui uma conta?
            <button className="cadastro__entrar" onClick={() => navigate("/login")}>
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import MenuConfig from "/src/components/MenuConfig.jsx";
import { infoUsuario, atualizarDadosUsuario, atualizarSenhaUsuario } from "../../js/api/caio";
import { mensagemErro, mensagemSucesso } from "../../js/utils";



export default function Config_perfil({ onUpdateDados, onUpdateSenha }) {
  const [usuario, setUsuario] = useState(null);
  const [dados, setDados] = useState({ id: "", nome: "", email: "", telefone: "", cpf: "", dataNascimento: "" });
  const [senha, setSenha] = useState({ atual: "", nova: "", confirmar: "" });

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuarioObj = JSON.parse(usuarioStr);
      setUsuario(usuarioObj);
    }
  }, []);

  useEffect(() => {
    if (usuario && usuario.id) {
      infoUsuario(usuario.id)
        .then(data => {
          if (data) {
            setDados({
              id: data.id || "",
              nome: data.nome || "",
              email: data.email || "",
              telefone: data.telefone || "",
              cpf: data.cpf || "",
              dataNascimento: data.dataNascimento || ""
            });
          }
        })
        .catch(error => {
          console.error("Erro ao carregar informações do usuário:", error);
        });
    }
  }, [usuario]);

  const handleChangeDados = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };
  const handleChangeSenha = (e) => {
    setSenha({ ...senha, [e.target.name]: e.target.value });
  };

  const handleSubmitDados = async (e) => {
    e.preventDefault();
    try {
      await atualizarDadosUsuario(usuario.id, dados);
      mensagemSucesso("Dados atualizados com sucesso!");
    } catch (error) {
      mensagemErro("Erro ao atualizar dados do usuário.");
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  };

  const handleSubmitSenha = async (e) => {
    e.preventDefault();
    if (!senha.atual || !senha.nova || !senha.confirmar) {
      mensagemErro("Por favor, preencha todos os campos de senha.");
      return;
    }
    try {
      await atualizarSenhaUsuario(usuario.id, senha.atual, senha.nova, senha.confirmar);
      setSenha({ atual: "", nova: "", confirmar: "" }); // Limpa os campos após sucesso
    } catch (error) {
      mensagemErro("Erro ao atualizar senha do usuário.");
      console.error("Erro ao atualizar senha do usuário:", error);
    }
  };

  return (
    <MenuConfig>
      <form className="config_section_container" onSubmit={handleSubmitDados} autoComplete="off">
        <p className="titulo-1">Dados pessoais:</p>
        <div className="input_pai">
          <p className="paragrafo-2">Nome Completo</p>
          <input type="text" className="input" name="nome" placeholder="Digite seu nome" value={dados.nome} onChange={handleChangeDados} />
        </div>
        <div className="input_pai">
          <p className="paragrafo-2">Endereço de e-mail</p>
          <input type="email" className="input" name="email" placeholder="Digite seu e-mail" value={dados.email} onChange={handleChangeDados} />
        </div>
        <div className="input_pai">
          <p className="paragrafo-2">Número de telefone</p>
          <input type="text" className="input" name="telefone" placeholder="Digite seu número de telefone" value={dados.telefone} onChange={handleChangeDados} />
        </div>
        <div className="input_pai">
          <p className="paragrafo-2">CPF</p>
          <input type="text" className="input" name="cpf" placeholder="Digite seu CPF" value={dados.cpf} onChange={handleChangeDados} />
        </div>
        <div className="input_pai">
          <p className="paragrafo-2">Data de nascimento</p>
          <input type="text" className="input" name="dataNascimento" placeholder="Digite sua data de nascimento" value={dados.dataNascimento} onChange={handleChangeDados} />
        </div>
        <button className="btn-rosa" style={{ width: "100%" }} type="submit">
          Atualizar
        </button>
      </form>
      <div className="config_section_divisor"></div>
      <form className="config_section_container" onSubmit={handleSubmitSenha} autoComplete="off">
        <p className="titulo-1">Alterar senha:</p>
        <div className="input_pai">
          <p className="paragrafo-2">Senha atual</p>
          <input type="password" className="input" name="atual" placeholder="Digite aqui" value={senha.atual} onChange={handleChangeSenha} />
        </div>
        <div className="input_pai">
          <p className="paragrafo-2">Nova senha</p>
          <input type="password" className="input" name="nova" placeholder="Digite aqui" value={senha.nova} onChange={handleChangeSenha} />
        </div>
        <div className="input_pai">
          <p className="paragrafo-2">Confirmar nova senha</p>
          <input type="password" className="input" name="confirmar" placeholder="Digite aqui" value={senha.confirmar} onChange={handleChangeSenha} />
        </div>
        <button className="btn-rosa" style={{ width: "100%" }} type="submit" >
          Atualizar
        </button>
      </form>
    </MenuConfig>
  );
}

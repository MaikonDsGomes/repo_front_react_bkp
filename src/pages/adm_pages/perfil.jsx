import React, { useEffect, useState } from "react";
import MenuDash from "../../components/MenuDash";
import {
  listarInfoSalao,
  mudarSenha,
  editarInfoSalaoCompleto,
  listarUsuarioPorId,
  atualizarUsuario,
} from "../../js/api/kaua";
import {atualizarFotoUsuario} from "../../js/api/caio";
import { mensagemSucesso, mensagemErro } from "../../js/utils";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const usuarioFt = JSON.parse(localStorage.getItem("usuario"));
  const [fotoPreview, setFotoPreview] = useState(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
    return usuarioLocal.foto == null ? "/src/assets/img/usuario_foto_def.png" : `${usuarioLocal.foto}`;
  });
  const [usuarioEdicao, setUsuarioEdicao] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [infoSalao, setInfoSalao] = useState({
    email: "",
    telefone: "",
    logradouro: "",
    numero: "",
    cidade: "",
    estado: "",
    complemento: "",
  });

  // Busca dados do usuário logado
  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");
    if (usuarioStorage) {
      const user = JSON.parse(usuarioStorage);
      setUsuario(user);
      carregarUsuario(user.id);
    }
  }, []);

  const carregarUsuario = async (id) => {
    try {
      const dados = await listarUsuarioPorId(id);
      setUsuarioEdicao(dados);
    } catch {
      mensagemErro("Erro ao carregar dados do usuário.");
    }
  };

  const handleChangeUsuario = (e) => {
    const { id, value } = e.target;
    setUsuarioEdicao((prev) => ({ ...prev, [id]: value }));
  };
  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (file && usuario && usuario.id) {
      try {
        await atualizarFotoUsuario(usuario.id, file);
        mensagemSucesso("Foto atualizada com sucesso!");
        window.location.reload();
        const url = await buscarFotoUsuario(usuario.id);
        setFotoPreview(url);
        // Atualiza localStorage
        const usuarioAtual = JSON.parse(localStorage.getItem("usuario"));
        if (usuarioAtual) {
          usuarioAtual.foto = url;
          localStorage.setItem("usuario", JSON.stringify(usuarioAtual));
        }
      } catch (error) {
        mensagemErro("Erro ao atualizar foto.");
      }
    }
  };
  const handleAtualizarUsuario = async () => {
    if (!usuarioEdicao.nome || !usuarioEdicao.email || !usuarioEdicao.telefone || !usuarioEdicao.cpf) {
      mensagemErro("Preencha todos os campos antes de atualizar.");
      return;
    }
    try {
      await atualizarUsuario(usuario.id, usuarioEdicao);
      mensagemSucesso("Dados pessoais atualizados com sucesso!");
    } catch {
      mensagemErro("Erro ao atualizar os dados pessoais.");
    }
  };

  const handleMudarSenha = async () => {
    if (!usuario || !senhaAtual || !novaSenha || !confirmarSenha) {
      mensagemErro("Preencha todos os campos.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      mensagemErro("As senhas não coincidem.");
      return;
    }
    try {
      await mudarSenha(usuario.id, novaSenha, senhaAtual);
      mensagemSucesso("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch {
      mensagemErro("Erro ao alterar a senha. Verifique a senha atual.");
    }
  };

  // Busca informações do salão
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await listarInfoSalao();
        if (response && response.length > 0) setInfoSalao(response[0]);
      } catch {
        mensagemErro("Erro ao buscar informações do salão.");
      }
    };
    fetchInfo();
  }, []);

  const handleChangeSalao = (e) => {
    const { id, value } = e.target;
    setInfoSalao((prev) => ({ ...prev, [id]: value }));
  };

  const handleAtualizarSalao = async () => {
    const camposObrigatorios = ["email", "telefone", "logradouro", "numero", "cidade", "estado"];
    const camposVazios = camposObrigatorios.filter(
      (campo) => !infoSalao[campo] || infoSalao[campo].trim() === ""
    );

    if (camposVazios.length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios antes de atualizar.");
      return;
    }

    try {
      await editarInfoSalaoCompleto(infoSalao);
      mensagemSucesso("Informações do salão atualizadas com sucesso!");
    } catch {
      mensagemErro("Erro ao atualizar informações do salão.");
    }
  };

  return (
    <MenuDash>
      {/* DADOS PESSOAIS */}
      <div className="w-full flex justify-center py-8">
        <div className="w-full max-w-4xl p-0 px-[10%] flex flex-col gap-4">

          <div className="foto_perfil_div">
            <img
              src={`http://localhost:8080/usuarios/foto/${usuarioFt.id}`}
              onError={(e) => { e.target.src = "/src/assets/img/usuario_foto_def.png"; }}
              alt="user_foto"
              className="w-40 h-40 rounded-[150px] object-cover object-center"
              style={{ objectFit: 'cover' }}
            />
            <input type="file" accept="image/*" id="foto" style={{ display: "none" }} onChange={handleFotoChange} />
            <label 
              htmlFor="foto" 
              style={{ color: "white", display:"flex", alignItems:"center", justifyContent:"center"}}
              className="bg-[#DD236D] hover:bg-[#b81c59] font-semibold rounded-[32px] cursor-pointer transition h-11 w-33 text-white"
            >Alterar Foto</label>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-gray-800">Dados pessoais:</h1>

          <div className="flex flex-col gap-2">
            <label htmlFor="nome" className="text-base font-medium">Nome completo</label>
            <input
              id="nome"
              type="text"
              value={usuarioEdicao.nome}
              onChange={handleChangeUsuario}
              placeholder="Digite seu nome completo"
              className="rounded-[16px] border-0 px-12 bg-white h-12"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-base font-medium">Endereço de e-mail</label>
            <input
              id="email"
              type="text"
              value={usuarioEdicao.email}
              onChange={handleChangeUsuario}
              placeholder="Digite seu endereço de e-mail"
              className="rounded-[16px] border-0 px-12 bg-white h-12"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="telefone" className="text-base font-medium">Número de telefone</label>
            <input
              id="telefone"
              type="text"
              value={usuarioEdicao.telefone}
              onChange={handleChangeUsuario}
              placeholder="Digite seu número de telefone"
              className="rounded-[16px] border-0 px-12 bg-white h-12"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="cpf" className="text-base font-medium">CPF</label>
            <input
              id="cpf"
              type="text"
              value={usuarioEdicao.cpf}
              onChange={handleChangeUsuario}
              placeholder="Digite seu CPF"
              className="rounded-[16px] border-0 px-12 bg-white h-12"
            />
          </div>

          <div className="flex flex-col items-end">
            <input
              className="bg-[#DD236D] hover:bg-[#b81c59] font-semibold rounded-[32px] cursor-pointer transition h-11 w-full text-white"
              type="button"
              value="Atualizar"
              style={{ color: "white" }}
              onClick={handleAtualizarUsuario}
            />
          </div>
        </div>
      </div>

      {/* ALTERAR SENHA */}
      <div className="w-full flex justify-center py-8">
        <div className="w-full max-w-4xl p-0 px-[10%] flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Alterar senha:</h1>

          <div className="flex flex-col gap-2">
            <label htmlFor="inp_senha_inp" className="text-base font-medium">Senha atual</label>
            <input
              id="inp_senha_inp"
              type="password"
              placeholder="Digite sua senha atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className="rounded-[16px] border-0 px-12 bg-white h-12"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="inp_nova_senha_inp" className="text-base font-medium">Nova senha</label>
            <input
              id="inp_nova_senha_inp"
              type="password"
              placeholder="Digite sua nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="rounded-[16px] border-0 px-12 bg-white h-12"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="inp_nova_senha_confirmacao_inp" className="text-base font-medium">Confirmar nova senha</label>
            <input
              id="inp_nova_senha_confirmacao_inp"
              type="password"
              placeholder="Digite sua nova senha novamente"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="rounded-[16px] border-0 px-12 bg-white h-12"
            />
          </div>

          <div className="flex flex-col items-end">
            <input
              className="bg-[#DD236D] hover:bg-[#b81c59] font-semibold rounded-[32px] cursor-pointer transition h-11 w-full text-white"
              type="button"
              value="Atualizar"
              style={{ color: "white" }}
              onClick={handleMudarSenha}
            />
          </div>
        </div>
      </div>

      {/* INFORMAÇÕES DO SALÃO */}
      <div className="w-full flex justify-center py-8">
        <div className="w-full max-w-4xl p-0 px-[10%] flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Informações do Salão</h1>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-base font-medium">E-mail</label>
            <input
              id="email"
              value={infoSalao.email}
              onChange={handleChangeSalao}
              placeholder="Digite email do salão"
              type="text"
              className="rounded-[16px] border-0 px-12 bg-white h-12"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="telefone" className="text-base font-medium">Número de telefone</label>
            <input
              id="telefone"
              value={infoSalao.telefone}
              onChange={handleChangeSalao}
              placeholder="Digite o número de telefone do salão"
              type="text"
              className="rounded-[16px] border-0 px-12 bg-white h-12"
            />
          </div>

          <div className="flex gap-5">
            <div className="flex flex-col flex-1 gap-2">
              <label htmlFor="logradouro" className="text-base font-medium">Logradouro</label>
              <input
                id="logradouro"
                value={infoSalao.logradouro}
                onChange={handleChangeSalao}
                placeholder="Digite o logradouro do salão"
                type="text"
                className="rounded-[16px] border-0 px-12 bg-white h-12"
              />
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label htmlFor="numero" className="text-base font-medium">Número</label>
              <input
                id="numero"
                value={infoSalao.numero}
                onChange={handleChangeSalao}
                placeholder="Digite o número do salão"
                type="text"
                className="rounded-[16px] border-0 px-12 bg-white h-12"
              />
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex flex-col flex-1 gap-2">
              <label htmlFor="cidade" className="text-base font-medium">Cidade</label>
              <input
                id="cidade"
                value={infoSalao.cidade}
                onChange={handleChangeSalao}
                placeholder="Digite a cidade"
                type="text"
                className="rounded-[16px] border-0 px-12 bg-white h-12"
              />
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label htmlFor="estado" className="text-base font-medium">Estado</label>
              <input
                id="estado"
                value={infoSalao.estado}
                onChange={handleChangeSalao}
                placeholder="Digite o estado"
                type="text"
                className="rounded-[16px] border-0 px-12 bg-white h-12"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="complemento" className="text-base font-medium">Complemento</label>
            <input
              id="complemento"
              value={infoSalao.complemento}
              onChange={handleChangeSalao}
              placeholder="Digite o complemento"
              type="text"
              className="rounded-[16px] border-0 px-12 bg-white h-12"
            />
          </div>

          <div className="flex flex-col items-end">
            <input
              className="bg-[#DD236D] hover:bg-[#b81c59] font-semibold rounded-[32px] cursor-pointer transition h-11 w-full text-white"
              type="button"
              value="Atualizar"
              style={{ color: "white" }}
              onClick={handleAtualizarSalao}
            />
          </div>
        </div>
      </div>
    </MenuDash>
  );
}
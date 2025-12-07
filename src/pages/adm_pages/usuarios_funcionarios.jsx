import { useEffect, useState } from "react";
import MenuDash from "../../components/MenuDash";
import CardCliente from "../../components/CardCliente";
import UsuariosHeader from "../../components/UsuariosHeader";
import FormularioCriarFuncionario from "../../components/FormularioCriarFuncionario";
import FuncionarioDetalhes from "../../components/FuncionarioDetalhes";
import {
  listarFuncionarios,
  listarUsuarioPorId,
  criarUsuarioFuncionario,
  editarUsuarioCliente,
  deletarUsuarioCliente,
  getFotoPerfilUsuario,
} from "../../js/api/kaua";
import { mensagemErro, mensagemSucesso } from "../../js/utils";
import "../../css/pages/adm_pages/usuarios/clientes.css";

export default function Usuarios_funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("create");
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  useEffect(() => {
    buscarFuncionarios();
  }, []);

  const buscarFuncionarios = async () => {
    try {
      const data = await listarFuncionarios();

      // 🔹 Para cada funcionário, buscar a foto de perfil individual
      const funcionariosComFoto = await Promise.all(
        data.map(async (funcionario) => {
          try {
            const blob = await getFotoPerfilUsuario(funcionario.id);
            const fotoUrl = URL.createObjectURL(blob);
            return { ...funcionario, foto: fotoUrl };
          } catch {
            // Se não tiver foto, aplica uma padrão
            return { ...funcionario, foto: "src/assets/img/sem-foto.png" };
          }
        })
      );

      setFuncionarios(funcionariosComFoto);
    } catch (error) {
      mensagemErro("Erro ao buscar a lista de funcionários.");
      console.error(error);
    }
  };

  const handleCriarFuncionario = async (novoFuncionario) => {
    try {
      await criarUsuarioFuncionario(novoFuncionario);
      mensagemSucesso("Funcionário criado com sucesso!");
      setMostrarFormulario(false);
      await buscarFuncionarios();
    } catch (error) {
      mensagemErro("Erro ao criar funcionário.");
      console.error(error);
    }
  };

  const handleAtualizarFuncionario = async (formData) => {
    try {
      const funcionarioAtual = await listarUsuarioPorId(funcionarioSelecionado.id);
      const dadosParaAtualizar = { ...funcionarioAtual, ...formData };

      if (!dadosParaAtualizar.senha) delete dadosParaAtualizar.senha;

      await editarUsuarioCliente(funcionarioSelecionado.id, dadosParaAtualizar);
      mensagemSucesso("Funcionário atualizado com sucesso!");

      setMostrarFormulario(false);
      setFuncionarioSelecionado(null);

      setFuncionarios((prev) =>
        prev.map((f) =>
          f.id === funcionarioSelecionado.id ? { ...f, ...dadosParaAtualizar } : f
        )
      );
    } catch (error) {
      mensagemErro("Erro ao atualizar funcionário.");
      console.error(error);
    }
  };

  const handleExcluirFuncionario = async (id) => {
    try {
      await deletarUsuarioCliente(id);
      mensagemSucesso("Funcionário excluído com sucesso!");
      setMostrarFormulario(false);
      setFuncionarioSelecionado(null);

      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      mensagemErro("Erro ao excluir funcionário.");
      console.error(error);
    }
  };

  const handleEditar = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setModoFormulario("edit");
    setMostrarFormulario(true);
  };

  const handleDetalhes = (id) => {
    setFuncionarioSelecionado({ id });
    setMostrarDetalhes(true);
  };

  return (
    <MenuDash>
      <UsuariosHeader
        tipo="funcionarios"
        onButtonClick={() => {
          setModoFormulario("create");
          setFuncionarioSelecionado(null);
          setMostrarFormulario(true);
        }}
        iconSrc="src/assets/svg/plus.svg"
      />

      <div
        className="dash_section_container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          flexDirection: "row",
        }}
      >
        {funcionarios.length > 0 ? (
          funcionarios.map((funcionario) => (
            <CardCliente
              key={funcionario.id}
              nome={funcionario.nome}
              email={funcionario.email}
              telefone={funcionario.telefone}
              foto={funcionario.id}
              onEditar={() => handleEditar(funcionario)}
              onDetalhes={() => handleDetalhes(funcionario.id)}
              exibirPendencias={false}
            />
          ))
        ) : (
          <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
            Nenhum funcionário encontrado.
          </p>
        )}
      </div>

      {mostrarFormulario && (
        <div className="overlay-form">
          <FormularioCriarFuncionario
            mode={modoFormulario}
            initialData={funcionarioSelecionado}
            onCancel={() => setMostrarFormulario(false)}
            onSubmit={
              modoFormulario === "create"
                ? handleCriarFuncionario
                : handleAtualizarFuncionario
            }
            onDelete={handleExcluirFuncionario}
          />
        </div>
      )}

      {mostrarDetalhes && funcionarioSelecionado && (
        <FuncionarioDetalhes
          idFuncionario={funcionarioSelecionado.id}
          onClose={() => {
            setMostrarDetalhes(false);
            setFuncionarioSelecionado(null);
          }}
        />
      )}
    </MenuDash>
  );
}
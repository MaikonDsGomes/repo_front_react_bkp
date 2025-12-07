import { useEffect, useState } from "react";
import MenuDash from "../../components/MenuDash";
import CardCliente from "../../components/CardCliente";
import UsuariosHeader from "../../components/UsuariosHeader";
import FormularioCriarCliente from "../../components/FormularioCriarCliente";
import ClienteDetalhes from "../../components/ClienteDetalhes"; // ✅ Importa o popup de detalhes
import {
  listarClientes,
  listarUsuarioPorId,
  criarUsuarioCliente,
  editarUsuarioCliente,
  deletarUsuarioCliente,
  getFotoPerfilUsuario
} from "../../js/api/kaua";
import { mensagemErro, mensagemSucesso } from "../../js/utils";

export default function Usuarios_clientes() {
  const [clientes, setClientes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false); // ✅ Novo estado pra o popup
  const [modoFormulario, setModoFormulario] = useState("create");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  useEffect(() => {
    buscarClientes();
  }, []);

  const buscarClientes = async () => {
  try {
    const data = await listarClientes();

    const clientesComFoto = await Promise.all(
      data.map(async (cliente) => {
        try {
          const blob = await getFotoPerfilUsuario(cliente.id);
          const fotoUrl = URL.createObjectURL(blob); // Converte Blob → URL de imagem
          return { ...cliente, foto: fotoUrl };
        } catch {
          // Se der erro (ex: sem foto), adiciona uma imagem padrão
          return { ...cliente, foto: "src/assets/img/usuario_foto_def.png" };
        }
      })
    );

    setClientes(clientesComFoto);
  } catch (error) {
    mensagemErro("Erro ao buscar a lista de clientes.");
    console.error(error);
  }
};

  const handleCriarCliente = async (novoCliente) => {
    try {
      await criarUsuarioCliente(novoCliente);
      mensagemSucesso("Cliente criado com sucesso!");
      setMostrarFormulario(false);
      await buscarClientes();
    } catch (error) {
      mensagemErro("Erro ao criar cliente.");
      console.error(error);
    }
  };

  const handleAtualizarCliente = async (formData) => {
    try {
      const clienteAtual = await listarUsuarioPorId(clienteSelecionado.id);
      const dadosParaAtualizar = { ...clienteAtual, ...formData };

      if (!dadosParaAtualizar.senha) delete dadosParaAtualizar.senha;

      await editarUsuarioCliente(clienteSelecionado.id, dadosParaAtualizar);
      mensagemSucesso("Cliente atualizado com sucesso!");

      setMostrarFormulario(false);
      setClienteSelecionado(null);

      setClientes((prev) =>
        prev.map((c) =>
          c.id === clienteSelecionado.id ? { ...c, ...dadosParaAtualizar } : c
        )
      );
    } catch (error) {
      mensagemErro("Erro ao atualizar cliente.");
      console.error(error);
    }
  };

  const handleExcluirCliente = async (id) => {
    try {
      await deletarUsuarioCliente(id);
      mensagemSucesso("Cliente excluído com sucesso!");
      setMostrarFormulario(false);
      setClienteSelecionado(null);

      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      mensagemErro("Erro ao excluir cliente.");
      console.error(error);
    }
  };

  const handleEditar = (cliente) => {
    setClienteSelecionado(cliente);
    setModoFormulario("edit");
    setMostrarFormulario(true);
  };

  const handleDetalhes = (id) => {
    setClienteSelecionado({ id });
    setMostrarDetalhes(true);
  };

  return (
    <MenuDash>
      <UsuariosHeader
        tipo="clientes"
        onButtonClick={() => {
          setModoFormulario("create");
          setClienteSelecionado(null);
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
        {clientes.length > 0 ? (
          clientes.map((cliente) => (
            <CardCliente
              key={cliente.id}
              nome={cliente.nome}
              email={cliente.email}
              telefone={cliente.telefone}
              foto={cliente.id}
              pendencias={cliente.pendencias}
              onEditar={() => handleEditar(cliente)}
              onDetalhes={() => handleDetalhes(cliente.id)}
            />
          ))
        ) : (
          <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
            Nenhum cliente encontrado.
          </p>
        )}
      </div>

      {mostrarFormulario && (
        <div className="overlay-form">
          <FormularioCriarCliente
            mode={modoFormulario}
            initialData={clienteSelecionado}
            onCancel={() => setMostrarFormulario(false)}
            onSubmit={
              modoFormulario === "create"
                ? handleCriarCliente
                : handleAtualizarCliente
            }
            onDelete={handleExcluirCliente}
          />
        </div>
      )}

      {mostrarDetalhes && clienteSelecionado && (
        <ClienteDetalhes
          idCliente={clienteSelecionado.id}
          onClose={() => {
            setMostrarDetalhes(false);
            setClienteSelecionado(null);
          }}
        />
      )}
    </MenuDash>
  );
}
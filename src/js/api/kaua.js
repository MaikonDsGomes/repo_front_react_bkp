import api from "./api_port";

// 🔹 Listar informações do salão
export async function listarInfoSalao() {
  try {
    const response = await api.get("http://localhost:8080/info-salao");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar informações do salão:", error);
    throw error;
  }
}

// 🔹 Listar clientes
export async function listarClientes() {
  try {
    const response = await api.get("http://localhost:8080/usuarios/lista-clientes");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw error;
  }
}

// 🔹 Listar funcionários
export async function listarFuncionarios() {
  try {
    const response = await api.get("http://localhost:8080/usuarios/lista-funcionarios");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    throw error;
  }
}

// 🔹 Criar usuário cliente
export async function criarUsuarioCliente(novoUsuario) {
  try {
    const response = await api.post(
      "http://localhost:8080/usuarios/cadastro",
      novoUsuario
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário cliente:", error);
    throw error;
  }
}

export async function criarUsuarioFuncionario(novoUsuario) {
  try {
    const response = await api.post(
      "http://localhost:8080/usuarios",
      novoUsuario
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário funcionário:", error);
    throw error;
  }
}

// 🔹 Atualizar usuário (PUT)
export async function editarUsuarioCliente(id, usuarioAtualizado) {
  try {
    const usuarioAtual = await api.get(`http://localhost:8080/usuarios/${id}`);
    const dadosParaAtualizar = { ...usuarioAtual.data, ...usuarioAtualizado };
    const response = await api.put(
      `http://localhost:8080/usuarios/${id}`,
      dadosParaAtualizar
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
}

// 🔹 Deletar usuário
export async function deletarUsuarioCliente(id) {
  try {
    const response = await api.patch(
      `http://localhost:8080/usuarios/deletar/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
}

// 🔹 Buscar usuário por ID
export async function listarUsuarioPorId(id) {
  try {
    const response = await api.get(`http://localhost:8080/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}

export async function buscarDadosHistoricoPorIdAgendamento(idAgendamemto) {
    try {
        const response = await api.get(`http://localhost:8080/agendamento/historico/${idAgendamemto}`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar dado historico:", error);
        throw error;
    }
}

// 🔹 Mudar senha
export async function mudarSenha(id, newSenha, oldSenha) {
  try {
    const response = await api.patch(
      `http://localhost:8080/usuarios/mudarSenha/${id}`,
      { senhaAtual: oldSenha, novaSenha: newSenha }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    throw error;
  }
}

// 🔹 Atualizar informações do salão
export async function editarInfoSalaoCompleto(infoSalao) {
  try {
    const response = await api.put("http://localhost:8080/info-salao", infoSalao);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar informações do salão:", error);
    throw error;
  }
}

// Atualiza um usuário existente
export async function atualizarUsuario(id, usuarioAtualizado) {
  try {
    const usuarioAtual = await api.get(`http://localhost:8080/usuarios/${id}`);
    const dadosParaAtualizar = { ...usuarioAtual.data, ...usuarioAtualizado };
    const response = await api.put(`http://localhost:8080/usuarios/${id}`, dadosParaAtualizar);
    localStorage.setItem("usuario", JSON.stringify(dadosParaAtualizar));
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
}

export async function agendamentosPassadosUsuario(id) {
  try {
    const response = await api.get(`http://localhost:8080/agendamento/passados-usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos passados do usuário:", error);
    throw error;
  }
}

export async function agendamentosPassadosFuncionario(id) {
  try {
    const response = await api.get(`http://localhost:8080/agendamento/passados-funcionario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos passados do funcionário:", error);
    throw error;
  }
}

export async function listarServicosPorFuncionario(id) {
  try {
    const response = await api.get(`http://localhost:8080/funcionario-competencia/funcionario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços por funcionário:", error);
    throw error;
  }
}

export async function listarServicos() {
  try {
    const response = await api.get("http://localhost:8080/servicos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    throw error;
  }
}

// Deletar um serviço de um funcionário (DELETE)
export async function deletarServicoFuncionario(idCompetencia) {
  try {
    const response = await api.delete(`http://localhost:8080/funcionario-competencia/${idCompetencia}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar serviço do funcionário:", error);
    throw error;
  }
}

export async function criarServicoFuncionario(funcionarioCompetencia) {
  try {
    const response = await api.post(`http://localhost:8080/funcionario-competencia`, funcionarioCompetencia);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar serviço do funcionário:", error);
    throw error;
  }
}

export async function getFotoPerfilUsuario(id) {
  try {
    const response = await api.get(`http://localhost:8080/usuarios/foto/${id}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar foto de perfil do usuário:", error);
    throw error;
  }
}
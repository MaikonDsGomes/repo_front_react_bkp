import api from "./api_port";
import { mensagemErro, mensagemSucesso } from "../utils";

// PATCH foto do usuário
export async function atualizarFotoUsuario(id, fotoFile) {
  try {
    // Ler arquivo como ArrayBuffer e enviar diretamente no body
    const arrayBuffer = await fotoFile.arrayBuffer();
    const response = await api.patch(`http://localhost:8080/usuarios/foto/${id}`, arrayBuffer, {
      headers: { "Content-Type": "application/octet-stream" },
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    mensagemErro("Erro ao atualizar foto do usuário.");
    console.error("Erro ao atualizar foto do usuário:", error);
    throw error;
  }
}

// GET foto do usuário - retorna data URL (base64)
export async function buscarFotoUsuario(id) {
  try {
    const response = await api.get(`http://localhost:8080/usuarios/foto/${id}`, {
      responseType: 'arraybuffer'
    });
    const base64 = btoa(
      new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    const contentType = response.headers['content-type'] || 'image/png';
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    mensagemErro("Erro ao buscar foto do usuário.");
    console.error("Erro ao buscar foto do usuário:", error);
    throw error;
  }
}

export async function buscarProximoAgendamento(id) {
  try {
    const response = await api.get(`http://localhost:8080/agendamento/proximo-usuario/${id}`);
    console.log("Próximo agendamento!!!")
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return false
  }
}

export function cancelarAgendamentoJS(id) {
  try {
    api.patch(`http://localhost:8080/agendamento/status/${id}/2`);
    console.log("Agendamento cancelado com sucesso!");
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    return false;
  }
  return true;
}

export async function enviarMotivoCancelar({ id = null, descricao, agendamento }) {
  try {
    const payload = {
      id,
      descricao,
      agendamento    
    };

    const response = await api.post(`http://localhost:8080/cancelamentos`, payload);
    console.log("Motivo de cancelamento enviado com sucesso!", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar motivo de cancelamento:", error);
    throw error;
  }
}

export async function buscarAtendimentosPassados(id) {
  try {
    const response = await api.get(`http://localhost:8080/agendamento/passados-usuario/${id}`);
    console.log("Historico de agendamentos!!!")
    console.log(response.data)
    // ordenar por campo 'data' (formato yyyy-mm-dd) — mais recente primeiro
    if (Array.isArray(response.data)) {
      response.data.sort((a, b) => {
        const da = a?.data ?? '';
        const db = b?.data ?? '';
        // criar Date a partir de yyyy-mm-dd (constrói corretamente no formato ISO)
        const ta = da ? new Date(da) : 0;
        const tb = db ? new Date(db) : 0;
        return tb - ta; // mais recente primeiro
      });
    }

    return response.data;

  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
}

export async function buscarCupons(id) {
  try {
    const response = await api.get(`http://localhost:8080/cupom-destinado/lista/${id}`);
    console.log("Cupons disponíveis!!!")
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar cupons:", error);
    throw error;
  }
}

export async function infoUsuario(id) {
  try {
    const response = await api.get(`http://localhost:8080/usuarios/${id}`);
    console.log("Informações do usuário!!!")
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    throw error;
  }
}

export async function atualizarDadosUsuario(id, dados) {
  try {
    const usuarioAtual = await api.get(`http://localhost:8080/usuarios/${id}`);
    const dadosParaAtualizar = { ...usuarioAtual.data, ...dados };

    await api.put(`http://localhost:8080/usuarios/${id}`, dadosParaAtualizar);
    localStorage.setItem("usuario", JSON.stringify(dados));
    console.log("Dados do usuário atualizados com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error);
    return false;
  }
  return true;
}

export function atualizarSenhaUsuario(id, senhaBody) {
  try {
    api.patch(`http://localhost:8080/usuarios/mudarSenha/${id}`, senhaBody);
    console.log("Senha do usuário atualizada com sucesso!");
  } catch (error) {
    mensagemErro("Erro ao atualizar senha do usuário.");
    console.error("Erro ao atualizar senha do usuário:", error);
    return false;
  }
  return true;
}

export async function buscarFuncionamento() {
  try {
    const response = await api.get(`http://localhost:8080/funcionamento`);
    console.log("Funcionamento do salão!!!")
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar funcionamento do salão:", error);
    throw error;
  }
}

export function editarFuncionamento(id, dados) {
  try {
    api.put(`http://localhost:8080/funcionamento/${id}`, dados);
    console.log("Funcionamento do salão editado com sucesso!");
  } catch (error) {
    console.error("Erro ao editar funcionamento do salão:", error);
    return false;
  }
  return true;
}

export async function buscarHorarioExcecao() {
  try {
    const response = await api.get(`http://localhost:8080/horario-execao`);
    console.log("HorarioExecao do salão!!!")
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar HorarioExecao do salão:", error);
    throw error;
  }
}

export async function cadastrarExcecao(dados) {
  try {
    const response = await api.post(`http://localhost:8080/horario-execao`, dados);
    console.log("Exceção cadastrada com sucesso!");
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar exceção:", error);
    throw error;
  }
}

export async function editarExcecao(id, dados) {
  try {
    const response = await api.patch(`http://localhost:8080/horario-execao/${id}`, dados);
    console.log("Exceção editada com sucesso!");
    return response.data;
  } catch (error) {
    console.error("Erro ao editar exceção:", error);
    throw error;
  }
}

export function deletarExcecao(id) {
  try {
    api.delete(`http://localhost:8080/horario-execao/${id}`);
    console.log("Exceção deletada com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar exceção:", error);
    return false;
  }
  return true;
}

export async function buscarMarinaPoints(id){
  try {
    const response = await api.get(`http://localhost:8080/cupons/points/${id}`);
    console.log("Marina Points buscados com sucesso!", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar Marina Points:", error);
    throw error;
  }
}

export async function atualizarMarinaPoints(data){
  try {
    await api.put(`http://localhost:8080/cupom-configuracao`, data);
    console.log("Marina Points atualizados com sucesso!");
    mensagemSucesso("Marina Points atualizados com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar Marina Points:", error);
    mensagemErro("Erro ao atualizar Marina Points.");
    throw error;
  }
}

export async function buscarMarinaPointsConfig(){
  try {
    const response = await api.get(`http://localhost:8080/cupom-configuracao`);
    console.log("Configuração do Marina Points buscada com sucesso!", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar configuração do Marina Points:", error);
    throw error;
  }
}
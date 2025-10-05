import axios from "axios";
import { mensagemErro, mensagemSucesso } from "../utils";

export async function buscarProximoAgendamento(id) {
  try {
    const response = await axios.get(`http://localhost:8080/agendamento/proximo-usuario/${id}`);
    console.log("Próximo agendamento!!!")
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
}

export function cancelarAgendamentoJS(id) {
  try {
    axios.patch(`http://localhost:8080/agendamento/status/${id}/2`);
    console.log("Agendamento cancelado com sucesso!");
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    return false;
  }
  return true;
}

export function enviarMotivoCancelar({ id = null, descricao, agendamento }) {
  try {
    axios.post(`http://localhost:8080/cancelamentos`, {
      id,
      descricao,
      agendamento
    });
    console.log("Motivo de cancelamento enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar motivo de cancelamento:", error);
    return false;
  }
  return true;
}

export async function buscarAtendimentosPassados(id) {
  try {
    const response = await axios.get(`http://localhost:8080/agendamento/passados-usuario/${id}`);
    console.log("Historico de agendamentos!!!")
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
}

export async function infoUsuario(id) {
  try {
    const response = await axios.get(`http://localhost:8080/usuarios/${id}`);
    console.log("Informações do usuário!!!")
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    throw error;
  }
}

export function atualizarDadosUsuario(id, dados) {
  try {
    axios.put(`http://localhost:8080/usuarios/${id}`, dados);
    localStorage.setItem("usuario", JSON.stringify(dados));
    console.log("Dados do usuário atualizados com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error);
    return false;
  }
  return true;
}

export function atualizarSenhaUsuario(id, senhaAtual, novaSenha, confirmarSenha) {

  if (novaSenha !== confirmarSenha) {
    console.error("A nova senha e a confirmação não coincidem.");
    mensagemErro("A nova senha e a confirmação não coincidem.");
    return false;
  } 
  else {
    try {
      axios.patch(`http://localhost:8080/usuarios/mudarSenha/${id}`, id, novaSenha);
      mensagemSucesso("Senha atualizada com sucesso!");
      console.log("Senha do usuário atualizada com sucesso!");
    } catch (error) {
      mensagemErro("Erro ao atualizar senha do usuário.");
      console.error("Erro ao atualizar senha do usuário:", error);
      return false;
    }
  }
  return true;
}

export async function buscarFuncionamento() {
  try {
    const response = await axios.get(`http://localhost:8080/funcionamento`);
    console.log("Funcionamento do salão!!!")
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar funcionamento do salão:", error);
    throw error;
  }
}

export async function buscarHorarioExcecao() {
  try {
    const response = await axios.get(`http://localhost:8080/horario-execao`);
    console.log("HorarioExecao do salão!!!")
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar HorarioExecao do salão:", error);
    throw error;
  }
}
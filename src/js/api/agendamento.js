import api from "./api_port";

export async function buscarProximosAgendamentosFuncionario(idFuncionario) {
  try {
    const id = Number(idFuncionario); 
    const response = await api.get(`http://localhost:8080/agendamento/proximos-funcionario/${id}`);return response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
}


export async function buscarAtendimentosPassadosPorIdFuncionario(idFuncionario) {
  try {
    const id = Number(idFuncionario); 
    const response = await api.get(`http://localhost:8080/agendamento/passados-funcionario/${id}`);
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
}

export async function concluirAgendamento(idAgendamento, valor) {
   try {
    const id = Number(idAgendamento); 
    const responsePreco = await api.patch(`http://localhost:8080/agendamento/valor/${id}/${valor}`);
    const responseStatus = await api.patch(`http://localhost:8080/agendamento/status/${id}/5`);
    console.log(id + " @#@# " + responseStatus.data)
    console.log(responsePreco.data)

    return responsePreco.data;

  } catch (error) {
    console.error("Erro ao concluir agendamento:", error);
    throw error;
  }
}

//A implementar
export async function buscarDetalhesAgendamento(idAgendamento) {
   try {
    const id = Number(idAgendamento); 
    const response = await api.patch(`http://localhost:8080/agendamento/buscarDetalhesAgendamento${id}`);
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Erro ao buscar agendamentos detalhes do agendamento:", error);
    throw error;
  }
}
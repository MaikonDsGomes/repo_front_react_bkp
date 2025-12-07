import api from "./api_port";

export async function listarClientes() {
    try {
        const response = await api.get(`http://localhost:8080/usuarios/lista-clientes`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        throw error;
    }
}

export async function listarServicos() {
    try {
        const response = await api.get(`http://localhost:8080/servicos`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        throw error;
    }
}

export async function exibirHorariosDisponiveis(idServico, data) {
    try {
        const id = Number(idServico);
        const response = await api.get(`http://localhost:8080/agendamento/horarios-disponiveis/${id}/${data}`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        throw error;
    }
}

export async function listarPagamento() {
    try {
        const response = await api.get(`http://localhost:8080/pagamento`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar pagementos:", error);
        throw error;
    }
}

export async function salvarAgendamento(idCliente, idServico, cupomSelecionado, idPagamento, data, horario) {
  try {
    let body = {
      usuario: idCliente,
      servico: idServico,
      statusAgendamento: 1,
      pagamento: idPagamento,
      data: data,
      inicio: horario
    };

    if (cupomSelecionado) {
      body.cupom = cupomSelecionado;
    }

    const response = await api.post(`http://localhost:8080/agendamento`, body);

    // Se o backend retornar erro 400, isso cai no catch automaticamente
    return response.data;

  } catch (error) {
    console.error("Erro ao salvar agendamento:", error);

    // Repassa o erro pro handleConfirmarAgendamento()
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

export async function realizarAvaliacao(dados) {
    try {

        const response = await api.post(`http://localhost:8080/avaliacao`, dados);

        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error("Erro ao salvar avaliacao:", error);
        throw error;
    }
}

export async function reagendarAgendamento(agendamentoId, dataSelecionada, horarioSelecionado) {

    const dados = {
        novaData: dataSelecionada,
        inicio: horarioSelecionado
    }

    try {
        const response = await api.patch(`http://localhost:8080/agendamento/reagendamento/${agendamentoId}`, dados);
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error("Erro ao reagendar avaliacao:", error);
        throw error;
    }
}
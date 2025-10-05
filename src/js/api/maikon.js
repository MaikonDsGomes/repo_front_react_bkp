import axios from "axios";

export async function listarClientes() {
    try {
        const response = await axios.get(`http://localhost:8080/usuarios`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        throw error;
    }
}

export async function listarServicos() {
    try {
        const response = await axios.get(`http://localhost:8080/servicos`);
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
        const response = await axios.get(`http://localhost:8080/agendamento/horarios-disponiveis/${id}/${data}`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        throw error;
    }
}

export async function listarPagamento() {
    try {
        const response = await axios.get(`http://localhost:8080/pagamento`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar pagementos:", error);
        throw error;
    }
}

export async function salvarAgendamento(idCliente, idServico, idPagamento, data, horario) {
    try {
        const body = {
            usuario: idCliente,
            servico: idServico,
            statusAgendamento: 1,
            pagamento: idPagamento,
            data: data,
            inicio: horario
        };

        const response = await axios.post(`http://localhost:8080/agendamento`, body);
        
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error("Erro ao salvar agendamento:", error);
        throw error;
    }
}

export async function buscarDadosHistoricoPorIdAgendamento(idAgendamemto){
     try {
        const response = await axios.get(`http://localhost:8080/agendamento/historico/${idAgendamemto}`);
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error("Erro ao buscar dado historico:", error);
        throw error;
    }
}

export async function realizarAvaliacao(dados) {
     try {
    
        const response = await axios.post(`http://localhost:8080/avaliacao`, dados);
        
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error("Erro ao salvar avaliacao:", error);
        throw error;
    }
}
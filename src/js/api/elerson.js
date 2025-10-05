import axios from "axios";
// ...existing code...

export async function buscarCancelamentosDashboard() {
  try {
    const response = await axios.get("http://localhost:8080/cancelamentos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cancelamentos do dashboard:", error);
    throw error;
  }
}

export async function buscarAvaliacoes() {
  try {
    const response = await axios.get("http://localhost:8080/avaliacao");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    throw error;
  }
}

export async function buscarServicos() {
  try {
    const response = await axios.get("http://localhost:8080/servicos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    throw error;
  }
}

export const atualizarServico = async (id, dadosServico, arquivo = null) => {
  try {
    // Preparar objeto base do serviço
    const servicoData = {
      nome: dadosServico.nome,
      preco: parseFloat(dadosServico.preco),
      tempo: dadosServico.tempo,
      status: dadosServico.status,
      simultaneo: Boolean(dadosServico.simultaneo),
      descricao: dadosServico.descricao || ''
    };

    // Se tem arquivo, converte para Base64 e adiciona ao objeto
    if (arquivo) {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Pegar apenas a parte Base64, removendo o prefixo data:image/*;base64,
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(arquivo);
      });
      
      // Adiciona o Base64 ao objeto de serviço
      servicoData.foto = base64;
    }
    
    // Enviar como JSON puro em vez de FormData
    const response = await axios.put(`http://localhost:8080/servicos/${id}`, servicoData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    throw error;
  }
};

export async function buscarFuncionariosCompetentes(servicoId) {
  try {
    const response = await axios.get(`http://localhost:8080/funcionario-competencia/servico/${servicoId}`);
    console.log("Funcionários competentes:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar funcionários competentes:", error);
    throw error;
  }
}